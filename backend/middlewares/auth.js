const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Chưa đăng nhập." });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Token không hợp lệ." });

        req.user = user; // Gán vào request để dùng ở controller
        next();
    });
}

module.exports = verifyToken;
