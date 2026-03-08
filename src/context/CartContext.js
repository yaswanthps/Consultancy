import React, { createContext, useState, useContext, useEffect } from 'react';

// Create Context
const CartContext = createContext();

// Custom hook to use the cart context
export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    // Load initial state from local storage or set to empty array
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Save cart to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // Add item to cart
    const addToCart = (product, quantity = 1, volume = '1 Liter Bottle') => {
        setCartItems(prevItems => {
            // Check if item with same ID and volume variant already exists
            const existingItemIndex = prevItems.findIndex(
                item => item.id === product.id && item.volume === volume
            );

            if (existingItemIndex >= 0) {
                // Increment quantity of existing item
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex].quantity += quantity;
                return updatedItems;
            } else {
                // Add new item
                // Calculate price based on the mock algorithm if no actual price exists
                const basePrice = product.price || (product.id * 50 + 100);
                let variantMultiplier = 1;

                // Adjust price based on volume
                if (volume.includes('5 Liter')) variantMultiplier = 5 * 0.95; // 5% discount
                else if (volume.includes('20 Liter')) variantMultiplier = 20 * 0.85; // 15% discount
                else if (volume.includes('200 Liter')) variantMultiplier = 200 * 0.75; // 25% discount

                const price = basePrice * variantMultiplier;

                return [...prevItems, {
                    ...product,
                    quantity,
                    volume,
                    price
                }];
            }
        });
    };

    // Remove item from cart
    const removeFromCart = (productId, volume) => {
        setCartItems(prevItems =>
            prevItems.filter(item => !(item.id === productId && item.volume === volume))
        );
    };

    // Update item quantity
    const updateQuantity = (productId, volume, newQuantity) => {
        if (newQuantity < 1) return; // Don't allow less than 1

        setCartItems(prevItems =>
            prevItems.map(item =>
                (item.id === productId && item.volume === volume)
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    // Clear cart
    const clearCart = () => {
        setCartItems([]);
    };

    // Get total number of items
    const getCartCount = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    // Get total price
    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartCount,
        getCartTotal
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
