const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const bcrypt = require('bcrypt');

// Đăng nhập
exports.login = async (req, res) => {
  const { email, password } = req.body;

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

    if (!user.is_verified) {
      return res.status(403).json({ message: 'Tài khoản chưa xác thực.', isVerified: false });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, isVerified: true }); // ✅ gửi rõ isVerified
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err });
  }
};


// Đăng ký
// exports.register = async (req, res) => {
//     const { email, password } = req.body;
//     console.log('Email:', email);
//     try {
//         const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
//         if (rows.length > 0) {
//             return res.status(400).json({ message: 'Email đã tồn tại' });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);
//         await pool.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);
//         res.status(201).json({ message: 'Đăng ký thành công' }); // login.js sẽ alert(message)
//     } catch (error) {
//         console.error('Lỗi máy chủ:', error.message || error);
//         res.status(500).json({
//             message: 'Lỗi máy chủ',
//             error: error.message || 'Không xác định'
//         });
//     }
// };

const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();


exports.register = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Kiểm tra email đã tồn tại chưa
      const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      if (existing.length > 0) {
        return res.status(400).json({ message: 'Email đã được đăng ký' });
      }
  
      // ✅ Mã hóa mật khẩu
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Tạo token xác thực
      const token = crypto.randomBytes(32).toString('hex');
  
      // Lưu vào CSDL
      await pool.query(
        'INSERT INTO users (email, password, is_verified, email_token) VALUES (?, ?, ?, ?)',
        [email, hashedPassword, false, token]
      );
  
      // Gửi email xác thực
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        }
      });
  
      const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
      const verifyUrl = `${baseUrl}/api/auth/verify-email?token=${token}`;

  
      await transporter.sendMail({
        from: 'Xác thực tài khoản web bán linh kiện điện tử <' + process.env.MAIL_USER + '>',
        to: email,
        subject: 'Xác thực tài khoản',
        html: `<p>Vui lòng nhấn vào link dưới để xác thực tài khoản:</p><a href="${verifyUrl}">${verifyUrl}</a>`
      });
  
      res.status(200).json({ message: 'Vui lòng xác thực để đăng ký thành công!' });
    } catch (err) {
      console.error('Lỗi khi đăng ký:', err);
      res.status(500).json({ message: 'Đã xảy ra lỗi server.' });
    }
  };
    
  exports.verifyEmail = async (req, res) => {
    const { token } = req.query;
  
    try {
      const [users] = await pool.query('SELECT * FROM users WHERE email_token = ?', [token]);
      if (users.length === 0) {
        return res.status(400).send('Token không hợp lệ hoặc đã được sử dụng.');
      }
  
      await pool.query('UPDATE users SET is_verified = ?, email_token = NULL WHERE email_token = ?', [true, token]);
      res.send('Xác thực email thành công! Bạn có thể đăng nhập.');
    } catch (err) {
      console.error('Lỗi xác thực:', err);
      res.status(500).send('Lỗi server trong quá trình xác thực.');
    }
  };

  // nút gửi lại xác thực email
exports.resendVerification = async (req, res) => {
  const { email } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    // Ẩn thông tin nếu user không tồn tại hoặc đã xác thực
    if (!user || user.is_verified) {
      return res.status(200).json({ message: "Nếu email hợp lệ, hệ thống sẽ gửi lại email xác thực." });
    }

    // Nếu hợp lệ → tiếp tục gửi lại token
    const token = crypto.randomBytes(32).toString('hex');
    await pool.query('UPDATE users SET email_token = ? WHERE email = ?', [token, email]);

    // ... Gửi lại email như cũ
    const verifyUrl = `${process.env.BASE_URL}/api/auth/verify-email?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `Xác thực tài khoản <${process.env.MAIL_USER}>`,
      to: email,
      subject: 'Gửi lại email xác thực',
      html: `<p>Bạn đã yêu cầu gửi lại email xác thực.</p><a href="${verifyUrl}">${verifyUrl}</a>`
    });

    res.status(200).json({ message: "Nếu email hợp lệ, hệ thống sẽ gửi lại email xác thực." });
  } catch (err) {
    console.error('Lỗi resend email:', err);
    res.status(500).json({ message: 'Lỗi server khi gửi lại email.' });
  }
};
  
// Lấy thông tin người dùng
exports.getMe = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT id, email, username, phonenumber, address, role, cardnumber, cardmonth, cardyear, cardday FROM users WHERE id = ?',
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
