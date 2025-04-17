require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productsRoutes');
const verifyToken = require('./middlewares/authMiddleware');
const adminRoutes = require('./routes/adminRoutes');
const cartRoutes = require('./routes/cartRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes); // Sử dụng route sản phẩm
app.use('/api/cart', cartRoutes);
app.use('/api/admin', adminRoutes);

// Lắng nghe cổng
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});



