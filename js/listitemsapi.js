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
  
        if (addToCartBtn) {
          addToCartBtn.addEventListener("click", () => {
            alert("Sản phẩm đã được thêm vào giỏ hàng!");
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
  