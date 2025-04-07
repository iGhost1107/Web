(function() {
    document.addEventListener("DOMContentLoaded", () => {
        // Load modal từ login.html
        fetch('login.html')
            .then(res => res.text())
            .then(html => {
                document.getElementById("auth-modal-container").innerHTML = html;
    
                // Sau khi modal được nạp vào DOM, gắn sự kiện
                setupAuthModal();
            })
            .catch(err => {
                console.error("Không thể tải login.html:", err);
            });
    
        function setupAuthModal() {
            const headerpage = document.getElementById("header-page");
            const userIcon = document.getElementById("user-icon");
            const modal = document.querySelector(".modal");
            const loginForm = document.getElementById("login-form");
            const registerForm = document.getElementById("register-form");
            const switchButtons = document.querySelectorAll(".auth-form__switch-button");
            const backButtons = document.querySelectorAll(".btn--normal");
            const usernameDisplay = document.getElementById("username-display");

              // URL server backend
             const API_URL = "http://localhost:3000";

    
            if (!userIcon || !modal || !loginForm || !registerForm) return;
    
            // Mở modal, mặc định là form Đăng ký
            userIcon.addEventListener("click", (e) => {
                e.preventDefault();
                modal.style.display = "flex";
                loginForm.style.display = "none";
                registerForm.style.display = "flex";
            });
    
            // Chuyển đổi giữa login <-> register
            switchButtons.forEach(btn => {
                btn.addEventListener("click", () => {
                    const isLoginVisible = loginForm.style.display === "flex";
                    loginForm.style.display = isLoginVisible ? "none" : "flex";
                    registerForm.style.display = isLoginVisible ? "flex" : "none";
                });
            });
    
            // Nút BACK để đóng modal
            backButtons.forEach(btn => {
                btn.addEventListener("click", () => {
                    modal.style.display = "none";
                    loginForm.style.display = "none";
                    registerForm.style.display = "none";
                });
            });
    
            // Click ngoài overlay để đóng modal
            window.addEventListener("click", (e) => {
                if (e.target.classList.contains("modal__overlay")) {
                    modal.style.display = "none";
                    loginForm.style.display = "none";
                    registerForm.style.display = "none";
                }
            });
    
            // Xử lý Đăng ký
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
                        alert("Đăng ký thành công! Mời bạn đăng nhập.");
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
    
            // Xử lý Đăng nhập
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
                        // Đăng nhập thành công: hiển thị tên
                        usernameDisplay.textContent = email;
                        loginForm.querySelector("input[name='email']").value = "";
                        loginForm.querySelector("input[name='password']").value = "";
                        usernameDisplay.style.display = "block";
                        modal.style.display = "none";
                        loginForm.style.display = "none";
                        registerForm.style.display = "none";
                        alert("Đăng nhập thành công");
                        // Có thể lưu token nếu muốn
                        localStorage.setItem("token", data.token);
                    } else {
                        alert(data.message || "Đăng nhập thất bại");
                    }
                } catch (err) {
                    alert("Lỗi kết nối server");
                }
            });
        }
    });
        
    })();
    