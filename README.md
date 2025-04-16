
1. Vào XAMPP hoặc MySQL 
  Tạo database: CREATE DATABASE shop_db

2. Chạy code này

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th4 10, 2025 lúc 05:32 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `shop_db`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cart_items`
--

CREATE TABLE `cart_items` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `thumbnail` varchar(255) DEFAULT NULL,
  `price` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `cart_items`
--

INSERT INTO `cart_items` (`id`, `user_id`, `product_id`, `quantity`, `created_at`, `thumbnail`, `price`) VALUES
(1, 1, 1, 2, '2025-04-09 05:47:29', NULL, 0),
(2, 5, 2, 9, '2025-04-09 06:53:22', NULL, 0),
(3, 5, 3, 1, '2025-04-09 07:55:12', NULL, 0),
(4, 5, 4, 1, '2025-04-09 07:56:51', NULL, 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `stock` int(11) DEFAULT 0,
  `rating` float DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `products`
--

INSERT INTO `products` (`id`, `name`, `price`, `description`, `image_url`, `category`, `stock`, `rating`, `created_at`, `updated_at`) VALUES
(2, 'Vi điều khiển STM32', 110000, 'Vi điều khiển STM32 hiệu suất cao, dùng trong các ứng dụng nhúng', 'https://example.com/pro.jpg', 'plc', 15, 4.2, '2025-04-08 17:29:43', '2025-04-10 01:17:13'),
(3, 'AVR ATmega328P', 90000, 'Vi điều khiển phổ biến trên Arduino UNO', 'https://example.com/images/atmega328p.png', 'arduino', 20, 4.6, '2025-04-08 17:29:43', '2025-04-08 17:29:43'),
(4, 'ESP32 Devkit', 110000, 'Vi điều khiển WiFi/Bluetooth tích hợp, phù hợp cho IoT', 'https://example.com/images/esp32.png', 'arduino', 25, 4.7, '2025-04-08 17:29:43', '2025-04-08 17:29:43'),
(5, 'Raspberry Pi Pico', 130000, 'Vi điều khiển giá rẻ, mạnh mẽ đến từ Raspberry Pi Foundation', 'https://example.com/images/pico.png', 'arduino', 18, 4.4, '2025-04-08 17:29:43', '2025-04-08 17:29:43'),
(8, 'Tai nghe Bluetooth', 990000, 'Tai nghe chống ồn cao cấp', 'https://example.com/image.jpg', 'Âm thanh', 0, 0, '2025-04-10 01:10:28', '2025-04-10 01:10:28'),
(9, 'Tai nghe Bluetooth', 990000, 'Tai nghe chống ồn cao cấp', 'https://example.com/image.jpg', 'Âm thanh', 0, 0, '2025-04-10 01:13:35', '2025-04-10 01:13:35'),
(10, 'Vi điều khiển STM32F401RE', 110000, 'Vi điều khiển STM32 cortex-M4', 'https://example.com/pro.jpg', 'plc', 0, 0, '2025-04-10 01:24:32', '2025-04-10 01:24:32'),
(11, 'Vi điều khiển STM32F401RE', 110000, 'Vi điều khiển STM32 cortex-M4', 'https://example.com/pro.jpg', 'plc', 0, 0, '2025-04-10 21:22:15', '2025-04-10 21:22:15');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `username` varchar(100) NOT NULL DEFAULT '',
  `phonenumber` varchar(20) NOT NULL DEFAULT '',
  `address` varchar(255) NOT NULL DEFAULT '',
  `role` enum('user','admin') DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `username`, `phonenumber`, `address`, `role`) VALUES
(1, 'test@example.com', '123456', '', '', '', 'user'),
(2, 'minhduc123', '123456', '', '', '', 'user'),
(3, 'hehe', '1111', '', '', '', 'user'),
(4, 'm', 'm', '', '', '', 'user'),
(5, '1', '$2b$10$G.HLZS8ndBqYIb17kosheOEaK6i34NrWXg6b4xkbHjLaoqfLA6epm', 'ho ho', '03728928', 'hiazz', 'admin');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`email`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;











3. Và thêm dòng này ở USERS database

ALTER TABLE users
ADD COLUMN cardnumber VARCHAR(50),
ADD COLUMN cardmonth VARCHAR(10),
ADD COLUMN cardyear VARCHAR(10),
ADD COLUMN cardday VARCHAR(10);




4. Tiếp theo cài đặt node.js

và dùng các lệnh:
npm install
npm init -y
npm install express mysql bcryptjs jsonwebtoken cors dotenv body-parser

Cuối cùng chạy tai /backend/       của file trên
node server.js   => mỗi lần muốn live-server test các tính năng backend chạy file này



   
