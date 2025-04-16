// routes/cartRoutes.js
const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middlewares/authMiddleware');
const {
  addToCart,
  getCart,
  updateCartItem,
  deleteCartItem,
  clearCart
} = require('../controllers/cartController');

router.get('/', verifyToken, getCart);
// router.post('/', verifyToken, addToCart);
router.post('/add', verifyToken, addToCart)
router.put('/update', verifyToken, updateCartItem);
router.delete('/delete/:product_id', verifyToken, deleteCartItem);
router.delete('/clear', verifyToken, clearCart);

module.exports = router;

