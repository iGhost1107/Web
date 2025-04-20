const express = require("express");
const router = express.Router();
const mysql = require("mysql");

// Tạo kết nối database riêng hoặc dùng chung từ server.js nếu bạn export
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Lấy tất cả sản phẩm
router.get("/", (req, res) => {
    const sql = "SELECT * FROM products";

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Lỗi truy vấn sản phẩm:", err);
            return res.status(500).json({ message: "Lỗi server khi truy vấn sản phẩm" });
        }
        res.json(results);
    });
});

module.exports = router;
