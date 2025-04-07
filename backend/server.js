require("dotenv").config();
const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Kết nối MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) throw err;
    console.log("Connected to MySQL database");
});

// Đăng ký người dùng
app.post("/register", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Missing fields" });

    // Kiểm tra xem email đã tồn tại chưa
    const checkUserSql = "SELECT * FROM users WHERE email = ?";
    db.query(checkUserSql, [email], (err, results) => {
        if (err) {
            console.error("Database error: ", err); // Để dễ dàng kiểm tra lỗi
            return res.status(500).json({ message: "Database error while checking email" });
        }
        if (results.length > 0) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Mã hóa mật khẩu
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                console.error("Error hashing password: ", err);
                return res.status(500).json({ message: "Error hashing password" });
            }

            const sql = "INSERT INTO users (email, password) VALUES (?, ?)";
            db.query(sql, [email, hash], (err, result) => {
                if (err) {
                    console.error("Error inserting user: ", err);
                    return res.status(500).json({ message: "Tên đăng nhập không hợp lệ hoặc đã tồn tại" });
                }
                res.status(201).json({ message: "User registered successfully" });
            });
        });
    });
});



// Đăng nhập người dùng
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Missing fields" });

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });
        if (results.length === 0) return res.status(401).json({ message: "Sai tên đăng nhập hoặc mật khẩu" });

        bcrypt.compare(password, results[0].password, (err, isMatch) => {
            if (err) return res.status(500).json({ message: "Error comparing passwords" });
            if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

            // Tạo JWT token
            const token = jwt.sign({ id: results[0].id, email: results[0].email }, process.env.JWT_SECRET, { expiresIn: "1h" });
            res.json({ message: "Login successful", token });
        });
    });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

const productRoutes = require('./routes/products.js');
app.use('/api/products', productRoutes);

