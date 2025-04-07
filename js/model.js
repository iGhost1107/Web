(function () {
    document.addEventListener("DOMContentLoaded", () => {
        // Nạp model.html vào div giỏ hàng
        fetch("model.html")
            .then(res => res.text())
            .then(html => {
                document.getElementById("cart-container").innerHTML = html;
                setupCartEvents();
            });

        function setupCartEvents() {
            const cartIcon = document.getElementById("cart-icon");
            const cartModal = document.getElementById("cart-modal");
            const closeCartBtn = document.getElementById("close-cart");
            const overlay = document.querySelector(".cart-modal__overlay");

            if (cartIcon && cartModal && closeCartBtn && overlay) {
                cartIcon.addEventListener("click", (e) => {
                    e.preventDefault();

                    const token = localStorage.getItem("token");
                    if (!token) {
                        alert("Vui lòng đăng nhập để xem giỏ hàng.");
                        return;
                    }

                    // Nếu có token, hiển thị modal giỏ hàng
                    cartModal.style.display = "flex";

                    // (Tùy chọn) Gọi API lấy dữ liệu giỏ hàng
                    fetch("/api/cart", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    .then(res => res.json())
                    .then(data => {
                        renderCartItems(data); // TODO: hiển thị sản phẩm vào modal
                    })
                    .catch(err => {
                        console.error("Lỗi khi lấy giỏ hàng:", err);
                        alert("Không thể tải giỏ hàng. Vui lòng thử lại.");
                    });
                });

                closeCartBtn.addEventListener("click", () => {
                    cartModal.style.display = "none";
                });

                overlay.addEventListener("click", () => {
                    cartModal.style.display = "none";
                });
            }
        }

        // Hàm để render dữ liệu sản phẩm vào giỏ hàng
        function renderCartItems(items) {
            const cartList = document.getElementById("cart-items"); // giả sử div này chứa sản phẩm
            if (!cartList) return;

            cartList.innerHTML = ""; // clear cũ

            if (items.length === 0) {
                cartList.innerHTML = "<p>Giỏ hàng trống.</p>";
                return;
            }

            items.forEach(item => {
                const itemEl = document.createElement("div");
                itemEl.classList.add("cart-item");
                itemEl.innerHTML = `
                    <img src="${item.image_url}" alt="${item.name}" />
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>Giá: ${item.price}đ</p>
                        <p>Số lượng: ${item.quantity}</p>
                    </div>
                `;
                cartList.appendChild(itemEl);
            });
        }
    });
})();
