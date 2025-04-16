const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const bcrypt = require('bcrypt');

// Đăng nhập
exports.login = async (req, res) => {
    const { email, password } = req.body;
    console.log('Email:', email);
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Sai email hoặc mật khẩu' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Sai email hoặc mật khẩu' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        res.json({ token });  // login.js yêu cầu token
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server', error: err });
    }
};

// Đăng ký
exports.register = async (req, res) => {
    const { email, password } = req.body;
    console.log('Email:', email);
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length > 0) {
            return res.status(400).json({ message: 'Email đã tồn tại' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);
        res.status(201).json({ message: 'Đăng ký thành công' }); // login.js sẽ alert(message)
    } catch (error) {
        console.error('Lỗi máy chủ:', error.message || error);
        res.status(500).json({
            message: 'Lỗi máy chủ',
            error: error.message || 'Không xác định'
        });
    }
};

// Lấy thông tin người dùng
exports.getMe = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT id, email, username, phonenumber, address, cardnumber, cardmonth, cardyear, cardday FROM users WHERE id = ?',
            [req.user.id]
        );

        if (!rows.length) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }

        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server', error: err });
    }
};

// Đổi mật khẩu
exports.changePassword = async (req, res) => {
    const { email, oldPassword, newPassword } = req.body;

    try {
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }

        const user = users[0];

        console.log('So sánh:', {
            oldPassword,
            hashedPassword: user.password
        });

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        console.log('✅ isMatch:', isMatch);
    if (!isMatch) {
            return res.status(400).json({ message: 'Mật khẩu cũ không chính xác' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await pool.query('UPDATE users SET password = ? WHERE email = ?', [hashedNewPassword, email]);

        res.json({ message: 'Đổi mật khẩu thành công' });

    } catch (error) {
        console.error('🔥 Lỗi máy chủ:', error.message || error);
        return res.status(500).json({
            message: 'Lỗi máy chủ',
            error: error.message || 'Không xác định'
        });
    }
};


// Cập nhật thông tin người dùng
exports.updateUserInfo = async (req, res) => {
    const userId = req.user.id;
    const { username, phonenumber, address, cardnumber, cardmonth, cardyear, cardday } = req.body;

    try {
        await pool.query(
            'UPDATE users SET username = ?, phonenumber = ?, address = ?, cardnumber = ?, cardmonth = ?, cardyear = ?, cardday = ? WHERE id = ?',
            [username, phonenumber, address, cardnumber, cardmonth, cardyear, cardday, userId]
        );

        res.json({ message: 'Cập nhật thông tin thành công' });
    } catch (err) {
        console.error('❌ Lỗi cập nhật thông tin:', err);
        res.status(500).json({ message: 'Lỗi máy chủ', error: err });
    }
};
