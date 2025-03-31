const header = document.querySelector("header");


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






