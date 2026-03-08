const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Loads the variables from .env

const app = express();

// Middleware
app.use(cors()); // Allow requests from React
app.use(express.json()); // Parse JSON bodies in requests

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Successfully connected to MongoDB!'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

// --- DATABASE MODEL ---
// This tells MongoDB what your data should look like
const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    date: { type: Date, default: Date.now }
});

// This creates a "Contacts" collection in your database
const Contact = mongoose.model('Contact', contactSchema);

// --- NEW: E-COMMERCE ORDER MODEL ---
const orderSchema = new mongoose.Schema({
    customerInfo: {
        firstName: String,
        lastName: String,
        email: String,
        address: String,
        city: String,
        zip: String
    },
    orderItems: [{
        id: String,
        title: String,
        price: Number,
        quantity: Number,
        volume: String
    }],
    payment: {
        method: String, // 'card', 'upi', 'cod'
        status: { type: String, default: 'Pending' } // Pending, Paid, Failed
    },
    totals: {
        subtotal: Number,
        shipping: Number,
        tax: Number,
        total: Number
    },
    orderStatus: { type: String, default: 'Processing' }, // Processing, Shipped, Delivered, Cancelled
    createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// Example API Route - Testing the connection
app.get('/api/test', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
});

// --- NEW ROUTE: STORE DATA IN MONGODB (Original Test Route) ---
app.post('/api/contact', async (req, res) => {
    try {
        // 1. Get the data that React sent us
        const { name, email, message } = req.body;

        // 2. Create a new Contact document using our model
        const newContact = new Contact({
            name: name,
            email: email,
            message: message
        });

        // 3. Save it to MongoDB
        await newContact.save();

        // 4. Tell React it was successful
        res.status(201).json({ success: true, message: 'Data saved successfully!' });

    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ==========================================
// E-COMMERCE ORDER CRUD ROUTES
// ==========================================

// 1. CREATE: Place a new order (Called from Checkout.js)
app.post('/api/orders', async (req, res) => {
    try {
        const orderData = req.body;

        // Optionally: if payment method is "card" or "upi" and it was "successful",
        // you could set payment.status = 'Paid' here before saving.
        if (orderData.payment && orderData.payment.method !== 'cod') {
            orderData.payment.status = 'Paid'; // Assuming validation passed on frontend for now
        }

        const newOrder = new Order(orderData);
        const savedOrder = await newOrder.save();

        res.status(201).json({
            success: true,
            message: 'Order placed successfully!',
            orderId: savedOrder._id
        });

    } catch (error) {
        console.error('Error saving order:', error);
        res.status(500).json({ success: false, message: 'Failed to place order.' });
    }
});

// 2. READ ALL: Get a list of all orders (For an Admin Dashboard)
app.get('/api/orders', async (req, res) => {
    try {
        // Fetch all orders, sorted by newest first
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json({ success: true, count: orders.length, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch orders.' });
    }
});

// 3. READ ONE: Get details of a single specific order
app.get('/api/orders/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found.' });
        }
        res.json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Invalid Order ID or Server Error.' });
    }
});

// 4. UPDATE: Change the status of an order (e.g., mark as "Shipped")
app.put('/api/orders/:id/status', async (req, res) => {
    try {
        const { orderStatus } = req.body;

        if (!orderStatus) {
            return res.status(400).json({ success: false, message: 'orderStatus is required.' });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { orderStatus: orderStatus },
            { new: true } // Return the updated document
        );

        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: 'Order not found.' });
        }

        res.json({ success: true, message: 'Order status updated!', order: updatedOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update order.' });
    }
});

// 5. DELETE: Remove an order completely
app.delete('/api/orders/:id', async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);

        if (!deletedOrder) {
            return res.status(404).json({ success: false, message: 'Order not found.' });
        }

        res.json({ success: true, message: 'Order deleted successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete order.' });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
