const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') }); // Loads the variables from .env in the same directory as this file
const Razorpay = require('razorpay');
const crypto = require('crypto');

const app = express();

// Middleware
app.use(cors()); // Allow requests from React
app.use(express.json()); // Parse JSON bodies in requests

// --- HELPER FUNCTIONS ---
const getStockAvailability = (stock) => {
    const s = Number(stock);
    if (s <= 0) return 'Out of Stock';
    if (s < 20) return 'Low Stock';
    return 'In Stock';
};


// --- DATABASE MODEL ---
// This tells MongoDB what your data should look like

// NEW: USER MODEL for Authentication
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Note: In a real app, always hash passwords (e.g., using bcrypt)!
    createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    subject: String,
    message: String,
    status: { type: String, default: 'unread' }, // 'unread' or 'read'
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
    orderStatus: { type: String, default: 'Placed' }, // Placed, Processing, Shipped, Delivered, Cancelled
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

// --- PRODUCT MODEL ---
const productSchema = new mongoose.Schema({
    id: { type: String },
    title: { type: String, required: true },
    category: { type: String, default: 'Circular Economy' },
    description: { type: String, default: '' },
    price: { type: Number, default: 0 },
    stock: { type: Number, default: 100 },
    availability: { type: String, default: 'In Stock' }, // 'In Stock', 'Low Stock', 'Out of Stock'
    unit: { type: String, default: '1 Liter Bottle' },
    image: { type: String, default: '/images/polyester-fabric.webp' },
    createdAt: { type: Date, default: Date.now }
});
const Product = mongoose.model('Product', productSchema);

// --- CONNECTION AND SYNC ---
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('Successfully connected to MongoDB!');
        // Sync stock statuses on startup
        try {
            const products = await Product.find({});
            console.log(`Checking ${products.length} products for status sync...`);
            let syncCount = 0;
            for (const product of products) {
                const correctStatus = getStockAvailability(product.stock);
                if (product.availability !== correctStatus) {
                    product.availability = correctStatus;
                    await product.save();
                    syncCount++;
                }
            }
            console.log(`Stock statuses synchronized. ${syncCount} products updated.`);
        } catch (err) {
            console.error('Error syncing stock statuses:', err);
        }
    })
    .catch((err) => {
        console.error('CRITICAL: Error connecting to MongoDB:', err.name, err.message);
        if (err.name === 'MongooseServerSelectionError') {
            console.log('\n--- TROUBLESHOOTING TIP ---');
            console.log('It looks like a Connection Error. This usually means you need to:');
            console.log('1. Go to MongoDB Atlas -> Network Access');
            console.log('2. Click "Add IP Address" -> "Add Current IP Address"');
            console.log('3. Restart this server (node index.js)');
            console.log('---------------------------\n');
        }
    });

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

// Register a new user
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists with this email.' });
        }

        // Create new user (WARNING: passwords should be hashed in production!)
        const newUser = new User({ name, email, password });
        await newUser.save();

        res.status(201).json({ success: true, message: 'User registered successfully!' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Server error during registration.' });
    }
});

// Login an existing user
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        // Check password (In production, compare with hashed password!)
        if (user.password !== password) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        res.json({ success: true, message: 'Login successful!', user: { name: user.name, email: user.email } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error during login.' });
    }
});

// Forgot Password implementation (Mock/Simplified)
app.post('/api/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            // Prevent email enumeration
            return res.json({ success: true, message: 'If this email exists, a password reset link has been sent.' });
        }

        // Simple mock implementation: Reset password directly to a temporary standard password
        // In reality, this should generate a secure token and send an email link.
        user.password = 'Reset1234';
        await user.save();

        res.json({ success: true, message: 'Your password has been temporarily reset to: Reset1234. Please login using this password.' });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ success: false, message: 'Server error during password reset.' });
    }
});

// Google OAuth login / register
app.post('/api/auth/google', async (req, res) => {
    try {
        const { name, email, googleId, picture } = req.body;
        console.log('Backend Google Auth received:', { name, email, googleId });

        if (!email || !googleId) {
            return res.status(400).json({ success: false, message: 'Invalid Google credentials.' });
        }

        // Find or create the user
        let user = await User.findOne({ email });
        console.log('User found in DB:', user ? 'Yes' : 'No');
        if (!user) {
            // Register new user via Google (no password needed)
            const randomPass = Math.random().toString(36).slice(-8);
            user = new User({
                name: name || email,
                email,
                password: `google_${googleId}_${randomPass}`, // placeholder — not used for login
            });
            await user.save();
            console.log('New user created via Google:', email);
        }

        res.json({ success: true, message: 'Google login successful!', user: { name: user.name, email: user.email, picture } });
    } catch (error) {
        console.error('Google auth error:', error);
        res.status(500).json({ success: false, message: 'Google authentication failed.' });
    }
});

// GET all users (Admin)
app.get('/api/admin/users', async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json({ success: true, count: users.length, users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch users.' });
    }
});

// Example API Route - Testing the connection
app.get('/api/test', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
});

// --- NEW ROUTE: STORE DATA IN MONGODB (Original Test Route) ---
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        const newContact = new Contact({
            name,
            email,
            phone,
            subject,
            message
        });

        await newContact.save();
        console.log('Message saved to DB:', newContact._id);
        res.status(201).json({ success: true, message: 'Message sent successfully!' });

    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET all messages (Admin)
app.get('/api/admin/messages', async (req, res) => {
    try {
        const messages = await Contact.find().sort({ date: -1 });
        console.log('Fetched messages count:', messages.length);
        res.json({ success: true, messages });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch messages.' });
    }
});

// DELETE a message (Admin)
app.delete('/api/admin/messages/:id', async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Message deleted.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete message.' });
    }
});

// UPDATE message status as read (Admin)
app.put('/api/admin/messages/:id/read', async (req, res) => {
    try {
        await Contact.findByIdAndUpdate(req.params.id, { status: 'read' });
        res.json({ success: true, message: 'Message marked as read.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update message.' });
    }
});

// ==========================================
// PRODUCT CRUD ROUTES
// ==========================================


// GET all products
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch products.' });
    }
});

// POST create a new product (Admin)
app.post('/api/products', async (req, res) => {
    try {
        const stock = Number(req.body.stock) || 0;
        const product = new Product({
            ...req.body,
            id: req.body.id || Date.now().toString(),
            stock: stock,
            availability: getStockAvailability(stock)
        });
        await product.save();
        res.status(201).json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create product.' });
    }
});

// PUT update a product (Admin)
app.put('/api/products/:id', async (req, res) => {
    try {
        const updates = { ...req.body };
        if (updates.stock !== undefined) {
            updates.stock = Number(updates.stock);
            updates.availability = getStockAvailability(updates.stock);
        }

        const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
        res.json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update product.' });
    }
});

// DELETE a product (Admin)
app.delete('/api/products/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Product deleted.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete product.' });
    }
});

// POST bulk seed products (called once to migrate from mockData)
app.post('/api/products/seed', async (req, res) => {
    try {
        const { products } = req.body;
        const count = await Product.countDocuments();
        if (count > 0) return res.json({ success: true, message: 'Already seeded.', count });
        await Product.insertMany(products);
        res.json({ success: true, message: `Seeded ${products.length} products.` });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Seed failed.' });
    }
});

// ==========================================
// RAZORPAY INTEGRATION ROUTES
// ==========================================

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'YOUR_RAZORPAY_KEY_ID',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'YOUR_RAZORPAY_KEY_SECRET',
});

// CREATE a Razorpay Order
app.post('/api/razorpay/order', async (req, res) => {
    try {
        const { amount } = req.body; // Amount in INR

        const options = {
            amount: Math.round(amount * 100), // Razorpay expects amount in paise
            currency: 'INR',
            receipt: 'receipt_' + Date.now(),
        };

        const order = await razorpay.orders.create(options);
        res.json({ success: true, order });
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ success: false, message: 'Failed to create Razorpay order' });
    }
});

// VERIFY a Razorpay Payment
app.post('/api/razorpay/verify', (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'YOUR_RAZORPAY_KEY_SECRET')
            .update(body.toString())
            .digest('hex');

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            res.json({ success: true, message: 'Payment verified successfully' });
        } else {
            res.status(400).json({ success: false, message: 'Invalid payment signature' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error during verification' });
    }
});

// ==========================================
// E-COMMERCE ORDER CRUD ROUTES
// ==========================================

// 1. CREATE: Place a new order (Called from Checkout.js)
app.post('/api/orders', async (req, res) => {
    try {
        const orderData = req.body;

        // Check stock availability first
        for (const item of orderData.orderItems) {
            // Try to find by _id first if it's a valid ObjectId, otherwise find by custom id
            const isObjectId = mongoose.Types.ObjectId.isValid(item.id);
            const product = await Product.findOne({
                $or: [
                    { id: item.id },
                    ...(isObjectId ? [{ _id: item.id }] : [])
                ]
            });

            if (!product) {
                return res.status(404).json({ success: false, message: `Product ${item.id} not found.` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ success: false, message: `Insufficient stock for ${product.title}. Available: ${product.stock}` });
            }
        }

        // Reduce stock for each item
        for (const item of orderData.orderItems) {
            const isObjectId = mongoose.Types.ObjectId.isValid(item.id);
            const product = await Product.findOneAndUpdate(
                {
                    $or: [
                        { id: item.id },
                        ...(isObjectId ? [{ _id: item.id }] : [])
                    ]
                },
                { $inc: { stock: -item.quantity } },
                { new: true }
            );

            if (product) {
                // Update availability status based on new stock level
                product.availability = getStockAvailability(product.stock);
                await product.save();
            }
        }

        if (orderData.payment && orderData.payment.method !== 'cod') {
            orderData.payment.status = 'Paid';
        }

        const newOrder = new Order(orderData);
        const savedOrder = await newOrder.save();

        res.status(201).json({
            success: true,
            message: 'Order placed successfully and stock updated!',
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
