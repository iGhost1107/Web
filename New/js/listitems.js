


(function() {
document.addEventListener("DOMContentLoaded", function () {
    const quantityInput = document.getElementById("product-quantity");
    const increaseBtn = document.getElementById("increase-qty");
    const decreaseBtn = document.getElementById("decrease-qty");

    // Kiểm tra nếu các phần tử tồn tại trên trang trước khi gán sự kiện
    if (increaseBtn && decreaseBtn && quantityInput) {
        increaseBtn.addEventListener("click", function () {
            quantityInput.value = parseInt(quantityInput.value) + 1;
        });

        decreaseBtn.addEventListener("click", function () {
            if (parseInt(quantityInput.value) > 1) {
                quantityInput.value = parseInt(quantityInput.value) - 1;
            }
        });

        // Đảm bảo giá trị nhập vào không nhỏ hơn 1
        quantityInput.addEventListener("input", function () {
            if (quantityInput.value === "" || parseInt(quantityInput.value) < 1) {
                quantityInput.value = 1;
            }
        });
    }
});

window.addEventListener("scroll", function(){
    header.classList.toggle ("sticky", window.scrollY > 0);
})

document.addEventListener("DOMContentLoaded", function () {
    const categoryLinks = document.querySelectorAll(".category-list__name");
    const brandFilters = document.querySelectorAll("input[name='brand']");
    const products = document.querySelectorAll(".grid__column-2-4");

    let selectedCategory = "all"; 
    let selectedBrands = new Set();

    function filterProducts() {
        products.forEach(product => {
            const productCategory = product.getAttribute("data-category");
            const productBrand = product.getAttribute("data-brand");

            const matchesCategory = (selectedCategory === "all" || productCategory === selectedCategory);
            
            const matchesBrand = (selectedBrands.size === 0 || selectedBrands.has(productBrand));

            if (matchesCategory && matchesBrand) {
                product.style.display = "block";
            } else {
                product.style.display = "none";
            }
        });
    }

    categoryLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();

            selectedCategory = this.getAttribute("data-category");

            categoryLinks.forEach(item => item.classList.remove("category-list__active"));
            this.classList.add("category-list__active");

            filterProducts();
        });
    });

    brandFilters.forEach(filter => {
        filter.addEventListener("change", function () {
            if (this.checked) {
                selectedBrands.add(this.value); 
            } else {
                selectedBrands.delete(this.value); 
            }
            filterProducts();
        });
    });

    filterProducts();
});

document.addEventListener("DOMContentLoaded", function () {
    const productItems = document.querySelectorAll(".home-product-item");
    const productDetail = document.getElementById("product-detail");
    const closeBtn = document.getElementById("close-detail");
    const detailImage = document.getElementById("detail-image");
    const detailName = document.getElementById("detail-name");
    const detailPrice = document.getElementById("detail-price");
    const addToCartBtn = document.getElementById("add-to-cart");
    
    productItems.forEach(item => {
        item.addEventListener("click", function () {
            const image = item.querySelector(".home-product-item__img").style.backgroundImage;
            const name = item.querySelector(".home-product-item__name").innerText;
            const price = item.querySelector(".home-product-item__price").innerText;
            
            detailImage.style.backgroundImage = image;
            detailName.innerText = name;
            detailPrice.innerText = price;
            
            productDetail.classList.add("show");
        });
    });
    
    closeBtn.addEventListener("click", function () {
        productDetail.classList.remove("show");
    });
    
    addToCartBtn.addEventListener("click", function () {
        alert("Sản phẩm đã được thêm vào giỏ hàng!");
    });
});

const detailDescription = document.getElementById("detail-description");

productItems.forEach(item => {
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
})();

document.addEventListener("DOMContentLoaded", async () => {
    
    const container = document.querySelector(".home-product .grid__row");

    try {
        const res = await fetch("/api/products");
        const products = await res.json();

        products.forEach(product => {
            const col = document.createElement("div");
            col.className = "grid__column-2-4";
            col.setAttribute("data-category", product.category);
            col.setAttribute("data-brand", product.brand);

            col.innerHTML = `
                <div class="home-product-item" onclick="showProductDetail('${product.name}', '${product.price.toLocaleString()}đ', '${product.description}', '${product.image_url}')">
                    <div class="home-product-item__img" style="background-image: url('${product.image_url}')"></div>
                    <h5 class="home-product-item__name">${product.name}</h5>
                    <div class="home-product-item__price"><span>${product.price.toLocaleString()}đ</span></div>
                </div>
            `;

            container.appendChild(col);
        });
    } catch (err) {
        console.error("Không thể load sản phẩm:", err);
    }
});





