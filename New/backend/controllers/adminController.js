const db = require('../config/db'); // pool từ mysql2/promise

// Thêm sản phẩm mới
exports.createProduct = async (req, res) => {
    const { name, price, description, image_url, category } = req.body;

    try {
        const [result] = await db.query(
            'INSERT INTO products (name, price, description, image_url, category) VALUES (?, ?, ?, ?, ?)',
            [name, price, description, image_url, category]
        );
        res.status(201).json({ message: 'Thêm sản phẩm thành công', id: result.insertId });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi khi thêm sản phẩm', error: err.message });
    }
};

// Cập nhật sản phẩm
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, price, description, image_url, category } = req.body;

    try {
        const [result] = await db.query(
            'UPDATE products SET name = ?, price = ?, description = ?, image_url = ?, category = ? WHERE id = ?',
            [name, price, description, image_url, category, id]
        );
        res.json({ message: 'Cập nhật sản phẩm thành công' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi khi cập nhật sản phẩm', error: err.message });
    }
};

// Xoá sản phẩm
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);
        res.json({ message: 'Xoá sản phẩm thành công' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi khi xoá sản phẩm', error: err.message });
    }
};
