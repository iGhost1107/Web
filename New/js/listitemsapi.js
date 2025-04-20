(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const categoryHeading = document.querySelector(".category__heading");
    const categoryLinks = document.querySelectorAll(".category-list__name");
    const priceFilters = document.querySelectorAll("input[name='price']");

    let selectedCategory = "all";
    let selectedPrices = [];
    let allProducts = [];

    // ======================================
    // 0. Fetch dữ liệu sản phẩm từ API
    // ======================================
    fetch("http://localhost:3000/api/products")
      .then((res) => res.json())
      .then((data) => {
        allProducts = data;
        filterAndRender();
        setupFilter();
        setupSearchAutocomplete()
      })
      .catch((err) => {
        console.error("Không thể tải sản phẩm:", err);
      });

    // ======================================
    // 1. Render sản phẩm ra HTML
    // ======================================
    function renderProducts(products) {
      const productList = document.getElementById("product-list");
      productList.innerHTML = "";

      products.forEach((product) => {
        const itemHTML = `
          <div class="grid__column-2-4" data-category="${product.category}" data-price="${product.price}">
            <div class="home-product-item">
              <div class="home-product-item__img" style="background-image: url('${product.image_url}')"></div>
              <h5 class="home-product-item__name">${product.name}</h5>
              <div class="home-product-item__price"><span>${product.price.toLocaleString()}đ</span></div>
              <div class="home-product-item__description" style="display:none">${product.description || "Không có mô tả."}</div>
            </div>
          </div>
        `;
        productList.insertAdjacentHTML("beforeend", itemHTML);
      });

      setupProductModal(); // Gán modal sau khi render
    }

    // ======================================
    // 2. Modal chi tiết sản phẩm
    // ======================================
    function setupProductModal() {
      const productItems = document.querySelectorAll(".home-product-item");
      const detailImage = document.getElementById("detail-image");
      const detailName = document.getElementById("detail-name");
      const detailPrice = document.getElementById("detail-price");
      const detailDescription = document.getElementById("detail-description");
      const productDetail = document.getElementById("product-detail");
      const closeBtn = document.getElementById("close-detail");
      const addToCartBtn = document.getElementById("add-to-cart");

      productItems.forEach((item) => {
        item.addEventListener("click", function () {
          const image = item.querySelector(".home-product-item__img").style.backgroundImage;
          const name = item.querySelector(".home-product-item__name").innerText;
          const price = item.querySelector(".home-product-item__price").innerText;
          const description = item.querySelector(".home-product-item__description")?.innerText || "Không có mô tả.";

          detailImage.style.backgroundImage = image;
          detailName.innerText = name;
          detailPrice.innerText = price;
          detailDescription.innerText = description;

          productDetail.classList.add("show");
        });
      });

      if (closeBtn) {
        closeBtn.addEventListener("click", () => {
          productDetail.classList.remove("show");
        });
      }

      // Đặt ở đầu file JS (listitemsapi.js)
    const API_URL = 'http://localhost:3000/api';

    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", async () => {
        const quantity = parseInt(document.getElementById("product-quantity").value) || 1;
        const name = detailName.innerText;
        const priceText = detailPrice.innerText.replace(/[^\d]/g, '');
        const price = parseInt(priceText);

        // Lấy token từ localStorage
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.");
          return;
        }

        // Lấy productId bằng cách match tên sản phẩm trong allProducts
        const matchedProduct = allProducts.find(p => p.name === name);
        if (!matchedProduct) return alert("Không tìm thấy sản phẩm.");

        const productId = matchedProduct.id;

        try {
          const res = await fetch(`${API_URL}/cart/add`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` // Gửi token để backend lấy userId
            },
            body: JSON.stringify({
              productId,
              quantity
            })
          });

          const data = await res.json();

          if (res.ok) {
            alert(data.message || "Đã thêm vào giỏ hàng!");
          } else {
            alert(data.message || "Thêm vào giỏ hàng thất bại.");
          }
        } catch (err) {
          console.error("Lỗi khi thêm vào giỏ:", err);
          alert("Không thể kết nối tới máy chủ.");
        }
      });
    }
  }

    // ======================================
    // 3. Lọc sản phẩm
    // ======================================
    function setupFilter() {
      categoryLinks.forEach((link) => {
        link.addEventListener("click", function (e) {
          e.preventDefault();
          selectedCategory = this.getAttribute("data-category");

          categoryLinks.forEach((item) => item.classList.remove("category-list__active"));
          this.classList.add("category-list__active");

          if (categoryHeading) {
            categoryHeading.innerText = this.innerText;
          }

          filterAndRender();
        });
      });

      priceFilters.forEach((filter) => {
        filter.addEventListener("change", function () {
          selectedPrices = Array.from(priceFilters)
            .filter((checkbox) => checkbox.checked)
            .map((checkbox) => checkbox.value);

          filterAndRender();
        });
      });
    }

    function filterAndRender() {
      let filtered = allProducts.filter((product) => {
        const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
        const matchesPrice =
          selectedPrices.length === 0 ||
          selectedPrices.some((range) => {
            const price = product.price;
            if (range === "under-200") return price < 200000;
            if (range === "200-500") return price >= 200000 && price <= 500000;
            if (range === "500-1000") return price > 500000 && price <= 1000000;
            return true;
          });

        return matchesCategory && matchesPrice;
      });

      renderProducts(filtered);
    }

    // ======================================
    // 4. Tăng/Giảm số lượng sản phẩm
    // ======================================
    const quantityInput = document.getElementById("product-quantity");
    const increaseBtn = document.getElementById("increase-qty");
    const decreaseBtn = document.getElementById("decrease-qty");

    if (increaseBtn && decreaseBtn && quantityInput) {
      increaseBtn.addEventListener("click", () => {
        quantityInput.value = parseInt(quantityInput.value) + 1;
      });

      decreaseBtn.addEventListener("click", () => {
        if (parseInt(quantityInput.value) > 1) {
          quantityInput.value = parseInt(quantityInput.value) - 1;
        }
      });

      quantityInput.addEventListener("input", () => {
        if (quantityInput.value === "" || parseInt(quantityInput.value) < 1) {
          quantityInput.value = 1;
        }
      });
    }
    
      
    // ======================================
      // 4. Tìm kiếm sản phẩm
      // ======================================
      function setupSearchAutocomplete() {
        const searchInput = document.getElementById("search-input");
        const suggestionsBox = document.getElementById("suggestions");
      
        if (!searchInput || !suggestionsBox) return;
      
        searchInput.addEventListener("input", function () {
          const keyword = this.value.toLowerCase();
          suggestionsBox.innerHTML = "";
      
          if (keyword.length === 0) {
            suggestionsBox.style.display = "none";
            return;
          }
      
          const filtered = allProducts
            .filter(p => p.name.toLowerCase().includes(keyword))
            .slice(0, 10); // Giới hạn 10 gợi ý
      
          if (filtered.length === 0) {
            suggestionsBox.style.display = "none";
            return;
          }
      
          filtered.forEach(product => {
            const item = document.createElement("div");
            item.className = "suggestion-item";
            item.textContent = product.name;
            item.addEventListener("click", function () {
              // ✅ Mở modal sản phẩm thay vì chuyển trang
              showProductDetailModal(product);
      
              // Ẩn gợi ý và xóa ô tìm kiếm nếu muốn
              suggestionsBox.style.display = "none";
            });
            suggestionsBox.appendChild(item);
          });
      
          suggestionsBox.style.display = "block";
        });
      
        document.addEventListener("click", function (e) {
          if (!suggestionsBox.contains(e.target) && e.target !== searchInput) {
            suggestionsBox.style.display = "none";
          }
        });
      }
      

      function showProductDetailModal(product) {
        const detailImage = document.getElementById("detail-image");
        const detailName = document.getElementById("detail-name");
        const detailPrice = document.getElementById("detail-price");
        const detailDescription = document.getElementById("detail-description");
        const productDetail = document.getElementById("product-detail");
      
        // 1. Tắt overlay và thanh tìm kiếm nếu đang hiển thị
        const overlay = document.getElementById("search-overlay");
        const searchWrapper = document.getElementById("search-wrapper");
        const suggestionsBox = document.getElementById("suggestions");
        const searchOverlay = document.getElementById("search-overlay");

        searchOverlay.style.display = "none";
        searchWrapper.style.display = "none";
        suggestionsBox.style.display = "none";

        detailImage.style.backgroundImage = `url('${product.image_url}')`;
        detailName.innerText = product.name;
        detailPrice.innerText = product.price.toLocaleString() + "đ";
detailDescription.innerText = product.description || "Không có mô tả.";
      
        productDetail.classList.add("show");
      }

    // ======================================
    // 5. Sticky Header
    // ======================================
    window.addEventListener("scroll", function () {
      const header = document.querySelector(".header");
      if (header) {
        header.classList.toggle("sticky", window.scrollY > 0);
      }
    });
  });
})();
