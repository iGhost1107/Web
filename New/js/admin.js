(function () {
    document.addEventListener("DOMContentLoaded", () => {
      const API = 'http://localhost:3000/api/admin';
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
  
      if (role !== "admin") {
        alert("Bạn không có quyền truy cập trang này!");
        window.location.href = "/";
        return;
      }
  
      const name = document.getElementById("name");
      const price = document.getElementById("price");
      const desc = document.getElementById("description");
      const image = document.getElementById("image_url");
      const category = document.getElementById("category");
      const btn = document.getElementById("admin-panel-btn");
      const list = document.getElementById("product-list");
  
      // Thêm sản phẩm
      btn.addEventListener("click", async () => {
        const data = {
          name: name.value,
          price: Number(price.value),
          description: desc.value,
          image_url: image.value,
          category: category.value
        };
  
        if (!data.name || !data.price || !data.image_url || !data.category) {
          alert("Vui lòng điền đầy đủ thông tin sản phẩm.");
          return;
        }
  
        const res = await fetch(API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(data)
        });
  
        const result = await res.json();
        alert(result.message);
        loadProducts();
      });
  
      // Tải danh sách sản phẩm
      async function loadProducts() {
        const res = await fetch('http://localhost:3000/api/products', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const products = await res.json();
  
        list.innerHTML = products.map(p => `
          <div class="product-item">
            <p><strong>${p.name}</strong> - ${p.price}đ</p>
            <p>${p.description}</p>
            <img src="${p.image_url}" alt="${p.name}" width="100"/>
            <p><em>Danh mục:</em> ${p.category}</p>
            <button onclick="deleteProduct(${p.id})">Xoá</button>
          </div>
        `).join("");
      }
  
      loadProducts();
    });
  
    
  })();