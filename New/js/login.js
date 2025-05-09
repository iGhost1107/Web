(function () {
    document.addEventListener("DOMContentLoaded", () => {
        const API_URL = 'http://localhost:3000/api/auth'; // đổi lại nếu cần

        // Load modal từ login.html
        fetch('login.html')
            .then(res => res.text())
            .then(html => {
                document.getElementById("auth-modal-container").innerHTML = html;
                setupAuthModal();
            })
            .catch(err => {
                console.error("Không thể tải login.html:", err);
            });

            function setupAuthModal() {
                const userIcon = document.getElementById("user-icon");
                const modal = document.querySelector(".modal");
                const loginForm = document.getElementById("login-form");
                const registerForm = document.getElementById("register-form");
                const switchButtons = document.querySelectorAll(".auth-form__switch-button");
                const backButtons = document.querySelectorAll(".btn--normal");
                const userInfoModal = document.querySelector(".modal--user-info");
                const userEmailSpan = document.getElementById("user-email");
                const logoutButton = document.getElementById("logout-btn");
    

                userIcon?.addEventListener("click", async () => {
                    const token = localStorage.getItem("token");
                    if (!token) {
                        modal.style.display = "flex";
                        loginForm.style.display = "flex";
                        registerForm.style.display = "none";
                        return;
                    }
    
                    try {
                        const res = await fetch(`${API_URL}/me`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        // if (!res.ok) throw new Error("Token hết hạn");
                        if (!res.ok) {
                            const errorText = await res.text(); // lấy text để debug
                            console.error("🚨 Server trả về lỗi:", res.status, errorText);
                            throw new Error("Token hết hạn hoặc không hợp lệ");
                        }
                        const user = await res.json();
                        localStorage.setItem('user', JSON.stringify(user));
                        
                        userEmailSpan.textContent = user.email;
                        document.getElementById("user-fullname").textContent = user.username || "(chưa có)";
                        document.getElementById("user-phone").textContent = user.phonenumber || "(chưa có)";
                        document.getElementById("user-address").textContent = user.address || "(chưa có)";
    
                        // 👉 kiểm tra role
                        if (user.role === 'admin') {
                            addProductBtn.style.display = "block";
                        } else {
                            addProductBtn.style.display = "none";
                        }
    
                        userInfoModal.style.display = "flex";
                    } catch (err) {
                        // localStorage.removeItem("token");
                        // alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
                        console.error("❌ Lỗi khi gọi /me:", err);
                        localStorage.removeItem("token");
                    
                        if (err instanceof SyntaxError) {
                            alert("Lỗi JSON từ server, không thể phân tích dữ liệu.");
                        } else {
                            alert("Phiên đăng nhập hết hạn hoặc lỗi server.");
                        }
                    }
                });
    
                switchButtons.forEach(btn => {
                    btn.addEventListener("click", () => {
                        const isLoginVisible = loginForm.style.display === "flex";
                        loginForm.style.display = isLoginVisible ? "none" : "flex";
                        registerForm.style.display = isLoginVisible ? "flex" : "none";
                    });
                });
    
                backButtons.forEach(btn => {
                    btn.addEventListener("click", () => {
                        modal.style.display = "none";
                        loginForm.style.display = "none";
                        registerForm.style.display = "none";
                        userInfoModal.style.display = "none";
                    });
                });
    
                window.addEventListener("click", (e) => {
                    if (e.target.classList.contains("modal__overlay")) {
                        modal.style.display = "none";
                        loginForm.style.display = "none";
                        registerForm.style.display = "none";
                        userInfoModal.style.display = "none";
                    }
                });
    
                // Đăng ký
                registerForm.querySelector(".btn--primary").addEventListener("click", async (e) => {
                    e.preventDefault();
                    const email = registerForm.querySelector("input[name='email']").value.trim();
                    const password = registerForm.querySelector("input[name='password']").value.trim();
                    const confirm = registerForm.querySelector("input[name='confirm']").value.trim();
    
                    if (!email || !password || !confirm) return alert("Vui lòng nhập đầy đủ thông tin");
                    if (password !== confirm) return alert("Mật khẩu không khớp");
    
                    try {
                        const res = await fetch(`${API_URL}/register`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ email, password }),
                        });
    
                        const data = await res.json();
                        if (res.ok) {
                            alert("Đăng ký thành công! Vui lòng kiểm tra email để xác thực trước khi đăng nhập.");
                            registerForm.style.display = "none";
                            loginForm.style.display = "flex";
                            registerForm.reset?.();
                        } else {
                            alert(data.message || "Đăng ký thất bại");
                        }
                    } catch (err) {
                        alert("Lỗi kết nối server");
                    }
                });
    
                // Đăng nhập
                loginForm.querySelector(".btn--primary").addEventListener("click", async (e) => {
                    e.preventDefault();
                    const email = loginForm.querySelector("input[name='email']").value.trim();
                    const password = loginForm.querySelector("input[name='password']").value.trim();
    
                    if (!email || !password) return alert("Vui lòng nhập đầy đủ thông tin");
    
                    try {
                        const res = await fetch(`${API_URL}/login`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ email, password }),
                        });
    
                        const data = await res.json();
    
                        if (res.ok) {
                            if (!data.isVerified) {
                                alert("Tài khoản chưa được xác thực. Vui lòng kiểm tra email và xác thực trước khi đăng nhập.");
                                return;
                            }
                
                            localStorage.setItem("token", data.token);
                            alert("Đăng nhập thành công");
                            modal.style.display = "none";
                            loginForm.reset?.();
                            registerForm.reset?.();
                              // ⏱️ Cho phép DOM cập nhật xong rồi mới reload
                            setTimeout(() => {
                                window.location.reload();
                            }, 300); // 300ms delay
                        } else {
                            alert(data.message || "Đăng nhập thất bại");
                        }
                    } catch (err) {
                        alert("Lỗi kết nối server");
                    }
                });
    
                logoutButton?.addEventListener("click", () => {
                    localStorage.removeItem("token");
                    userInfoModal.style.display = "none";
                    alert("Đã đăng xuất");
                });            
                
                document.getElementById("resend-link-btn")?.addEventListener("click", async () => {
                    const email = loginForm.querySelector("input[name='email']").value.trim();
                    if (!email) return alert("Vui lòng nhập email trước.");
                    try {
                      const res = await fetch(`${API_URL}/resend-verification`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email }),
                      });
                  
                      const data = await res.json();
                      
                      alert(data.message || "Đã gửi lại email xác thực");
                    } catch (err) {
                      alert("Không thể gửi lại email. Vui lòng thử lại sau.");
                    }
                });

            // Hiển thị form đổi mật khẩu
            const changePasswordBtn = document.getElementById("change-password-btn");
            const changePasswordModal = document.querySelector(".modal--change-password");

            changePasswordBtn?.addEventListener("click", () => {
                changePasswordModal.style.display = "flex";
            });
           // Xử lý khi nhấn nút "Hủy" đổi mật khẩu
            document.getElementById("cancel-change-password")?.addEventListener("click", () => {
            document.querySelector(".modal--change-password").style.display = "none";
        
            // Xoá từng trường nhập liệu thủ công
            document.getElementById("oldPassword").value = "";
            document.getElementById("newPassword").value = "";
            document.getElementById("confirmNewPassword").value = "";
        });
        
            
        // Xử lý khi nhấn "Đổi mật khẩu"
        document.getElementById("submit-change-password")?.addEventListener("click", async (e) => {
            e.preventDefault();
        
            const oldPassword = document.getElementById("oldPassword").value.trim();
            const newPassword = document.getElementById("newPassword").value.trim();
            const confirmNewPassword = document.getElementById("confirmNewPassword").value.trim();
        
            if (!oldPassword || !newPassword || !confirmNewPassword) {
                return alert("Vui lòng nhập đầy đủ thông tin");
            }
        
            if (newPassword !== confirmNewPassword) {
                return alert("Mật khẩu mới không khớp");
            }
        
            if (oldPassword === newPassword) {
                return alert("Mật khẩu mới không được trùng với mật khẩu cũ");
            }
        
            const email = document.getElementById("user-email").textContent.trim();
            const token = localStorage.getItem("token");
        
            try {
                const res = await fetch(`${API_URL}/change-password`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ email, oldPassword, newPassword })
                });
        
                const data = await res.json();
        
                if (res.ok) {
                    alert("Đổi mật khẩu thành công");
                    document.getElementById("oldPassword").value = "";
                    document.getElementById("newPassword").value = "";
                    document.getElementById("confirmNewPassword").value = "";
                    document.querySelector(".modal--change-password").style.display = "none";
                } else {
                    alert(data.message || "Đổi mật khẩu thất bại");
                }
            } catch (err) {
                alert("Lỗi kết nối server");
            }
        });
        

        // hien thi form them san pham
        const addProductBtn = document.getElementById("admin-panel-btn");
        const addProductForm = document.querySelector("#admin-panel-container");
          // Thêm sản phẩm
          addProductBtn?.addEventListener("click", () => {
              // Ẩn form thông tin tài khoản
            document.querySelector(".modal--user-info").style.display = "none";
            addProductForm.style.display = "flex";
        });
        
        document.getElementById("add-product")?.addEventListener("click", async () => {
            const name = document.getElementById("add-name").value.trim();
            const price = Number(document.getElementById("add-price").value.trim());
            const description = document.getElementById("add-description").value.trim();
            const image_url = document.getElementById("add-image_url").value.trim();
            const category = document.getElementById("add-category").value.trim();

            if (isNaN(price) || price < 0) {
                alert("Giá sản phẩm không hợp lệ.");
                return;
            }
            const token = localStorage.getItem("token");
        
            if (!name || !price || !image_url || !category) {
                alert("Vui lòng điền đầy đủ thông tin sản phẩm.");
                return;
            }
        
            try {
                const res = await fetch("http://localhost:3000/api/admin", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ name, price, description, image_url, category })
                });
        
                const result = await res.json();
                alert(result.message || "Thêm sản phẩm thành công!");
                document.getElementById("add-name").value = "";
                document.getElementById("add-price").value = "";
                document.getElementById("add-description").value = "";
                document.getElementById("add-image_url").value = "";
                document.getElementById("add-category").value = "";

                addProductForm.style.display = "none";
                // loadProducts(); // nếu có
            } catch (err) {
                console.error("❌ Lỗi khi thêm sản phẩm:", err);
                alert("Không thể thêm sản phẩm.");
            }
        });

        document.getElementById("back-to-user-info")?.addEventListener("click", () => {
            document.getElementById("admin-panel-container").style.display = "none";
          });
          

        // 🎯 Cập nhật thông tin người dùng
        const updateInfoModal = document.querySelector(".modal--update-info");

        document.getElementById("update-info-btn")?.addEventListener("click", async () => {
        const token = localStorage.getItem("token");
        if (!token) return alert("Bạn chưa đăng nhập");

        try {
            const res = await fetch(`${API_URL}/me`, {
            headers: { Authorization: `Bearer ${token}` }
            });
            const user = await res.json();

            document.getElementById("update-username").value = user.username || "";
            document.getElementById("update-phone").value = user.phonenumber || "";
            document.getElementById("update-address").value = user.address || "";

            document.getElementById("update-cardnumber").value = user.cardnumber || "";
            document.getElementById("update-cardmonth").value = user.cardmonth || "";
            document.getElementById("update-cardyear").value = user.cardyear || "";
            document.getElementById("update-cardday").value = user.cardday || "";

            updateInfoModal.style.display = "flex";
        } catch (err) {
            alert("Không thể tải thông tin người dùng");
        }
        });

        document.getElementById("cancel-update-info")?.addEventListener("click", () => {
        updateInfoModal.style.display = "none";
        });

        document.getElementById("submit-update-info")?.addEventListener("click", async () => {
        const username = document.getElementById("update-username").value.trim();
        const phonenumber = document.getElementById("update-phone").value.trim();
        const address = document.getElementById("update-address").value.trim();

        const cardnumber = document.getElementById("update-cardnumber").value.trim();
        const cardmonth = document.getElementById("update-cardmonth").value.trim();
        const cardyear = document.getElementById("update-cardyear").value.trim();
        const cardday = document.getElementById("update-cardday").value.trim();
        
        // Kiểm tra số điện thoại
        if (!/^0\d{9}$/.test(phonenumber)) {
            return alert("Số điện thoại không hợp lệ.");
        }

        // Kiểm tra số thẻ (nếu có nhập)
        if (cardnumber && !/^\d+$/.test(cardnumber)) {
            return alert("Số thẻ không hợp lệ.");
        }

        // Ép kiểu để đảm bảo là số
        const day = parseInt(cardday, 10);
        const month = parseInt(cardmonth, 10);
        const year = parseInt(cardyear, 10);
        const currentYear = new Date().getFullYear();

        // Kiểm tra tháng
        if (isNaN(month) || month < 1 || month > 12) {
            return alert("Tháng không hợp lệ.");
        }

        // Kiểm tra ngày
        if (isNaN(day) || day < 1 || day > 31) {
            return alert("Ngày không hợp lệ.");
        }

        // Kiểm tra năm
        if (isNaN(year)) {
            return alert(`Năm không hợp lệ.`);
        }

        // Kiểm tra ngày hợp lệ thực sự (ví dụ: không có ngày 31/02)
        const isValidDate = (d, m, y) => {
            const date = new Date(y, m - 1, d);
            return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
        };

        if (!isValidDate(day, month, year)) {
            return alert("Ngày, tháng, năm không hợp lệ");
        }


        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`${API_URL}/update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    username,
                    phonenumber,
                    address,
                    cardnumber,
                    cardmonth,
                    cardyear,
                    cardday
                })
            });
        
        
            let data;
            try {
                data = await res.json(); // Có thể lỗi ở đây
            } catch (jsonErr) {
                console.error("🔴 Lỗi phân tích JSON:", jsonErr);
                throw new Error("Phản hồi không phải JSON hợp lệ");
            }
        
            if (res.ok) {
                alert("Cập nhật thành công");
                updateInfoModal.style.display = "none";
        
                document.getElementById("update-username").value = username;
                document.getElementById("update-phone").value = phonenumber;
                document.getElementById("update-address").value = address;

                document.getElementById("update-cardnumber").value = cardnumber;
                document.getElementById("update-cardmonth").value = cardmonth;
                document.getElementById("update-cardyear").value = cardyear;
                document.getElementById("update-cardday").value = cardday;

            } else {
                alert(data.message || "Cập nhật thất bại");
            }
        } catch (err) {
            console.error("🔴 Lỗi trong khối try:", err);
            alert(err.message || "Lỗi kết nối server");
        }
        
        if (role !== "admin") {
            alert("Bạn không có quyền truy cập trang này!");
            window.location.href = "./index.html";
            return;
          }
      
          const name = document.getElementById("name");
          const price = document.getElementById("price");
          const desc = document.getElementById("description");
          const image = document.getElementById("image_url");
          const category = document.getElementById("category");
          const list = document.getElementById("product-list");
      
        

        /* ERROR HERE */ 
        });
              
        }
    });
})();
