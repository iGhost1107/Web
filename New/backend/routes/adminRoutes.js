const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Thêm sản phẩm
router.post('/', adminController.createProduct);

// Sửa sản phẩm
router.put('/:id', adminController.updateProduct);

// Xoá sản phẩm
router.delete('/:id', adminController.deleteProduct);

module.exports = router;
