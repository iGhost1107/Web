const pool = require('../config/db');

// Thêm sản phẩm vào giỏ hàng
exports.addToCart = async (req, res) => {
  const userId = req.user.id; // <-- lấy từ token
  const { productId, quantity } = req.body;

  try {
    const [rows] = await pool.query(
      'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );

    if (rows.length > 0) {
      await pool.query(
        'UPDATE cart_items SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
        [quantity, userId, productId]
      );
    } else {
      await pool.query(
        'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [userId, productId, quantity]
      );
    }

    res.status(200).json({ message: 'Đã thêm vào giỏ hàng' });
  } catch (error) {
    console.error('❌ Lỗi thêm giỏ hàng:', error);
    res.status(500).json({ message: 'Lỗi máy chủ', error });
  }
};

// Lấy giỏ hàng của người dùng (từ token)
exports.getCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const [cartItems] = await pool.query(`
      SELECT 
        ci.product_id,
        p.name AS productName,
        p.price,
        p.image_url,
        ci.quantity,
        (p.price * ci.quantity) AS total
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ?
    `, [userId]);

    res.status(200).json({
      userId,
      cart: cartItems
    });
  } catch (error) {
    console.error('❌ Lỗi khi lấy giỏ hàng:', error);
    res.status(500).json({ message: 'Lỗi máy chủ', error });
  }
};

// Cập nhật số lượng sản phẩm
exports.updateCartItem = async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  try {
    await pool.query(
      'UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?',
      [quantity, userId, productId]
    );
    res.status(200).json({ message: 'Cập nhật số lượng thành công' });
  } catch (error) {
    console.error('❌ Lỗi cập nhật số lượng:', error);
    res.status(500).json({ message: 'Lỗi máy chủ', error });
  }
};

// Xoá một sản phẩm khỏi giỏ hàng
exports.deleteCartItem = async (req, res) => {
  const userId = req.user.id;
  const productId = req.params.product_id; // Lấy product_id từ URL params

  try {
    await pool.query(
      'DELETE FROM cart_items WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );
    res.status(200).json({ message: 'Đã xoá sản phẩm khỏi giỏ hàng' });
  } catch (error) {
    console.error('❌ Lỗi xoá sản phẩm:', error);
    res.status(500).json({ message: 'Lỗi máy chủ', error });
  }
};

// Xoá toàn bộ giỏ hàng
exports.clearCart = async (req, res) => {
  const userId = req.user.id;

  try {
    await pool.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);
    res.status(200).json({ message: 'Đã xoá toàn bộ giỏ hàng' });
  } catch (error) {
    console.error('❌ Lỗi xoá toàn bộ giỏ hàng:', error);
    res.status(500).json({ message: 'Lỗi máy chủ', error });
  }
};
