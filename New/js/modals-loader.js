// js/modals-loader.js
(function() {
function loadModal(id, url) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            const wrapper = document.createElement("div");
            wrapper.innerHTML = data;
            document.body.appendChild(wrapper);
        })
        .catch(err => console.error("Error loading modal:", err));
}

document.addEventListener("DOMContentLoaded", function () {
    // Load modal HTMLs
    loadModal("auth-modal", "./modals/auth-modal.html");
    loadModal("cart-modal", "./modals/cart-modal.html");

    // Đợi một chút để modal load xong
    setTimeout(() => {
        const openAuthBtn = document.getElementById("open-auth-modal");

        openAuthBtn?.addEventListener("click", function () {
            const modal = document.getElementById("auth-modal");
            if (modal) modal.style.display = "";
        });

        // Đóng modal khi click vào nút đóng
        document.body.addEventListener("click", function (e) {
            if (e.target.matches(".modal .close") || e.target.matches(".modal")) {
                e.target.closest(".modal").style.display = "none";
            }
        });
    }, 300); // delay để đảm bảo modal đã được inject vào DOM
});
})();