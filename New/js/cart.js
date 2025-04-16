// // let items = [];

// // const cartStorage = {
// //   get: () => JSON.parse(localStorage.getItem('cartProducts')) || [],
// //   set: (cartProducts) => localStorage.setItem('cartProducts', JSON.stringify(cartProducts))
// // };

// // const formatPrice = (price) => {
// //   return parseFloat(price.toFixed(2)).toLocaleString();
// // };

// // const calculateTotal = () => {
// //   let totalPrice = 0;
// //   const cartGridItems = document.querySelectorAll('.product-in-cart');

// //   cartGridItems.forEach(item => {
// //     const quantityElement = item.querySelector('.quantity-input');
// //     const quantity = parseInt(quantityElement.value);
// //     const priceElement = item.querySelector('.price');
// //     const unitPrice = parseFloat(priceElement.getAttribute('data-unit-price'));
// //     const itemTotal = unitPrice * quantity;
// //     totalPrice += itemTotal;
// //   });

// //   const pricingContainer = document.querySelector('.pricing-container');
// //   if (pricingContainer) {
// //     pricingContainer.innerHTML = `
// //       <h3>Order Summary</h3>
// //       <div class="subtotal">
// //         <h3>Subtotal:</h3>
// //         <div>$${formatPrice(totalPrice)}</div>
// //       </div>
// //       <div class="shipping">
// //         <h3>Estimated Shipping:</h3>
// //         <div>FREE</div>
// //       </div>
// //       <div class="tax">
// //         <h3>Estimated Tax</h3>
// //         <div>$${formatPrice(totalPrice * 0.08)}</div>
// //       </div>
// //       <div class="total">
// //         <h3>Estimated Total</h3>
// //         <div>$${formatPrice(totalPrice * 1.08)}</div>
// //       </div>
// //       <div>
// //         <button class="checkout-btn">Checkout</button>
// //       </div>
// //     `;
// //   }
// // };

// // const updateQuantity = async (event) => {
// //   let quanVal = parseInt(event.target.value);
// //   if (isNaN(quanVal) || quanVal < 1) {
// //     quanVal = 1;
// //     event.target.value = 1;
// //   }

// //   const prod = event.target.closest('.product-in-cart');
// //   const prodId = parseInt(prod.getAttribute('data-id'));

// //   // Gọi API backend để cập nhật số lượng
// //   const token = localStorage.getItem("token");
// //   await fetch(`http://localhost:3000/api/cart/update`, {
// //     method: 'PUT',
// //     headers: {
// //       'Content-Type': 'application/json',
// //       'Authorization': `Bearer ${token}`
// //     },
// //     body: JSON.stringify({
// //       productId: prodId,
// //       quantity: quanVal
// //     })
// //   });

// //   // Cập nhật lại localStorage và UI
// //   let newCartItems = cartStorage.get().map(item => {
// //     if (item.product_id === prodId) {
// //       item.quantity = quanVal;
// //     }
// //     return item;
// //   });
// //   cartStorage.set(newCartItems);
// //   calculateTotal();
// // };


// // const removeItem = async (event) => {
// //   const prodRemove = event.target.closest('.product-in-cart').getAttribute('data-id');

// //   const token = localStorage.getItem("token");
// //   await fetch(`http://localhost:3000/api/cart/delete/${prodRemove}`, {
// //     method: 'DELETE',
// //     headers: {
// //       Authorization: `Bearer ${token}`
// //     }
// //   });

// //   let cartItems = cartStorage.get().filter(item => item.product_id !== parseInt(prodRemove));
// //   cartStorage.set(cartItems);
// //   event.target.closest('.product-in-cart').remove();

// //   if (cartItems.length === 0) {
// //     document.querySelector('.cart-items').innerHTML = '<h2>Your cart is empty</h2>';
// //   }

// //   calculateTotal();
// // };


// // document.addEventListener('DOMContentLoaded', () => {
// //   const API_URL = "http://localhost:3000/api/cart";
// //   const token = localStorage.getItem("token");

// //   if (!token) {
// //     alert("Vui lòng đăng nhập để xem giỏ hàng.");
// //     return;
// //   }

// //   fetch(API_URL, {
// //     headers: {
// //       Authorization: `Bearer ${token}`
// //     }
// //   })
// //     .then(res => res.json())
// //     .then(data => {
// //       items = data.cart || [];
// //       let cartItems = cartStorage.get();

// //       if (cartItems.length === 0 || !localStorage.getItem('cartProducts')) {
// //         cartStorage.set(items);
// //         cartItems = items;
// //       }

// //       const isCartPage = window.location.pathname.includes('cart.html');
// //       if (!isCartPage) return;

// //       const cartGrid = document.querySelector('.cart-items');
// //       if (cartItems.length === 0) {
// //         cartGrid.innerHTML = '<h2>Your cart is empty</h2>';
// //         calculateTotal();
// //       } else {
// //         cartGrid.innerHTML = '';
// //         cartItems.forEach(item => {
// //           const productHTML = `
// //             <div class="product-in-cart" data-id="${item.product_id}">
// //               <div class="product-in-cart-left">
// //                 <img src="${item.image_url}" alt="${item.productName}">
// //                 <div class="product-info">
// //                   <p>${item.productName}</p>
// //                   <p>Item #: ${item.product_id}</p>
// //                 </div>
// //               </div>
// //               <div class="product-in-cart-right">
// //                 <div>
// //                   <p>Each</p>
// //                   <div class="price" data-unit-price="${item.price}">$${item.price}</div>
// //                 </div>
// //                 <div class="quantity">
// //                   <label for="quantity-${item.product_id}">Qty:</label>
// //                   <input 
// //                     type="number" 
// //                     class="quantity-input" 
// //                     id="quantity-${item.product_id}" 
// //                     value="${item.quantity}" 
// //                     min="1"
// //                   />
// //                 </div>
// //                 <i class="fa-solid fa-x"></i>
// //               </div>
// //             </div>
// //           `;
// //           cartGrid.insertAdjacentHTML('beforeend', productHTML);
// //         });

// //         document.querySelectorAll('.fa-x').forEach(btn => {
// //           btn.addEventListener('click', removeItem);
// //         });

// //         calculateTotal();
// //       }
// //     })
// //     .catch(err => {
// //       console.error("Error loading cart:", err);
// //       alert("Không thể tải giỏ hàng.");
// //     });
// // });

// // document.addEventListener('input', event => {
// //   if (event.target.classList.contains('quantity-input')) {
// //     updateQuantity(event);
// //   }
// // });



// // document.addEventListener('click', async event => {
// //   if (event.target.classList.contains('checkout-btn')) {
// //     const token = localStorage.getItem("token");

// //     // Xoá giỏ hàng từ DB
// //     await fetch(`http://localhost:3000/api/cart/clear`, {
// //       method: 'DELETE',
// //       headers: {
// //         Authorization: `Bearer ${token}`
// //       }
// //     });

// //     // Làm sạch localStorage và UI
// //     cartStorage.set([]);
// //     items = [];

// //     const cartContainer = document.querySelector('.cart-items');
// //     cartContainer.innerHTML = `
// //       <div class="checkout-success">
// //         <h2>🎉 Checkout Successful!</h2>
// //         <p>Thank you for your purchase.</p>
// //       </div>
// //     `;

// //     const pricingContainer = document.querySelector('.pricing-container');
// //     if (pricingContainer) {
// //       pricingContainer.innerHTML = '';
// //     }

// //     setTimeout(() => {
// //       window.location.reload();
// //     }, 3000);
// //   }
// // });
// let items = [];

// const cartStorage = {
//   get: () => JSON.parse(localStorage.getItem('cartProducts')) || [],
//   set: (cartProducts) => localStorage.setItem('cartProducts', JSON.stringify(cartProducts))
// };

// const formatPrice = (price) => {
//   return parseFloat(price.toFixed(2)).toLocaleString();
// };

// const calculateTotal = () => {
//   let totalPrice = 0;
//   const cartGridItems = document.querySelectorAll('.product-in-cart');

//   cartGridItems.forEach(item => {
//     const quantityElement = item.querySelector('.quantity-input');
//     const quantity = parseInt(quantityElement.value);
//     const priceElement = item.querySelector('.price');
//     const unitPrice = parseFloat(priceElement.getAttribute('data-unit-price'));
//     const itemTotal = unitPrice * quantity;
//     totalPrice += itemTotal;
//   });

//   const pricingContainer = document.querySelector('.pricing-container');
//   if (pricingContainer) {
//     pricingContainer.innerHTML = `
//       <h3>Order Summary</h3>
//       <div class="subtotal">
//         <h3>Subtotal:</h3>
//         <div>$${formatPrice(totalPrice)}</div>
//       </div>
//       <div class="shipping">
//         <h3>Estimated Shipping:</h3>
//         <div>FREE</div>
//       </div>
//       <div class="tax">
//         <h3>Estimated Tax</h3>
//         <div>$${formatPrice(totalPrice * 0.08)}</div>
//       </div>
//       <div class="total">
//         <h3>Estimated Total</h3>
//         <div>$${formatPrice(totalPrice * 1.08)}</div>
//       </div>
//       <div>
//         <button class="checkout-btn">Checkout</button>
//       </div>
//     `;
//   }
// };

// const updateQuantity = async (event) => {
//   let quanVal = parseInt(event.target.value);
//   if (isNaN(quanVal) || quanVal < 1) {
//     quanVal = 1;
//     event.target.value = 1;
//   }

//   const prod = event.target.closest('.product-in-cart');
//   const prodId = parseInt(prod.getAttribute('data-id'));

//   // Gọi API backend để cập nhật số lượng
//   const token = localStorage.getItem("token");
//   const response = await fetch(`http://localhost:3000/api/cart/update`, {
//     method: 'PUT',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${token}`
//     },
//     body: JSON.stringify({
//       productId: prodId,
//       quantity: quanVal
//     })
//   });

//   if (response.ok) {
//     // Cập nhật lại UI
//     items = items.map(item => {
//       if (item.product_id === prodId) {
//         item.quantity = quanVal;
//       }
//       return item;
//     });

//     calculateTotal();
//   } else {
//     alert("Cập nhật giỏ hàng thất bại.");
//   }
// };

// const removeItem = async (event) => {
//   const prodRemove = event.target.closest('.product-in-cart').getAttribute('data-id');

//   const token = localStorage.getItem("token");
//   const response = await fetch(`http://localhost:3000/api/cart/delete/${prodRemove}`, {
//     method: 'DELETE',
//     headers: {
//       Authorization: `Bearer ${token}`
//     }
//   });

//   if (response.ok) {
//     // Xóa item khỏi giỏ hàng
//     items = items.filter(item => item.product_id !== parseInt(prodRemove));
//     event.target.closest('.product-in-cart').remove();

//     if (items.length === 0) {
//       document.querySelector('.cart-items').innerHTML = '<h2>Your cart is empty</h2>';
//     }

//     calculateTotal();
//   } else {
//     alert("Xóa sản phẩm thất bại.");
//   }
// };

// document.addEventListener('DOMContentLoaded', () => {
//   const API_URL = "http://localhost:3000/api/cart";
//   const token = localStorage.getItem("token");

//   if (!token) {
//     alert("Vui lòng đăng nhập để xem giỏ hàng.");
//     return;
//   }

//   // Lấy giỏ hàng từ API thay vì localStorage
//   fetch(`${API_URL}`, {
//     headers: {
//       Authorization: `Bearer ${token}`
//     }
//   })
//     .then(res => res.json())
//     .then(data => {
//       items = data.cart || [];
//       const cartGrid = document.querySelector('.cart-items');
//       if (items.length === 0) {
//         cartGrid.innerHTML = '<h2>Your cart is empty</h2>';
//         calculateTotal();
//       } else {
//         cartGrid.innerHTML = '';
//         items.forEach(item => {
//           const productHTML = `
//             <div class="product-in-cart" data-id="${item.product_id}">
//               <div class="product-in-cart-left">
//                 <img src="${item.image_url}" alt="${item.productName}">
//                 <div class="product-info">
//                   <p>${item.productName}</p>
//                   <p>Item #: ${item.product_id}</p>
//                 </div>
//               </div>
//               <div class="product-in-cart-right">
//                 <div>
//                   <p>Each</p>
//                   <div class="price" data-unit-price="${item.price}">$${item.price}</div>
//                 </div>
//                 <div class="quantity">
//                   <label for="quantity-${item.product_id}">Qty:</label>
//                   <input 
//                     type="number" 
//                     class="quantity-input" 
//                     id="quantity-${item.product_id}" 
//                     value="${item.quantity}" 
//                     min="1"
//                   />
//                 </div>
//                 <i class="fa-solid fa-x"></i>
//               </div>
//             </div>
//           `;
//           cartGrid.insertAdjacentHTML('beforeend', productHTML);
//         });

//         // Add event listeners to remove buttons
//         document.querySelectorAll('.fa-x').forEach(btn => {
//           btn.addEventListener('click', removeItem);
//         });

//         calculateTotal();
//       }
//     })
//     .catch(err => {
//       console.error("Error loading cart:", err);
//       alert("Không thể tải giỏ hàng.");
//     });
// });

// document.addEventListener('input', event => {
//   if (event.target.classList.contains('quantity-input')) {
//     updateQuantity(event);
//   }
// });

// document.addEventListener('click', async event => {
//   if (event.target.classList.contains('checkout-btn')) {
//     const token = localStorage.getItem("token");

//     // Xoá giỏ hàng từ DB
//     const response = await fetch(`http://localhost:3000/api/cart/clear`, {
//       method: 'DELETE',
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     });

//     if (response.ok) {
//       // Làm sạch UI và localStorage
//       items = [];
//       cartStorage.set([]);
//       const cartContainer = document.querySelector('.cart-items');
//       cartContainer.innerHTML = `
//         <div class="checkout-success">
//           <h2>🎉 Checkout Successful!</h2>
//           <p>Thank you for your purchase.</p>
//         </div>
//       `;
//       const pricingContainer = document.querySelector('.pricing-container');
//       if (pricingContainer) {
//         pricingContainer.innerHTML = '';
//       }

//       setTimeout(() => {
//         window.location.reload();
//       }, 3000);
//     } else {
//       alert("Thanh toán không thành công.");
//     }
//   }
// });
let items = [];

const formatPrice = (price) => {
  return parseFloat(price.toFixed(2)).toLocaleString();
};

const calculateTotal = () => {
  let totalPrice = 0;
  const cartGridItems = document.querySelectorAll('.product-in-cart');

  cartGridItems.forEach(item => {
    const quantityElement = item.querySelector('.quantity-input');
    const quantity = parseInt(quantityElement.value);
    const priceElement = item.querySelector('.price');
    const unitPrice = parseFloat(priceElement.getAttribute('data-unit-price'));
    const itemTotal = unitPrice * quantity;
    totalPrice += itemTotal;
  });

  const pricingContainer = document.querySelector('.pricing-container');
  if (pricingContainer) {
    pricingContainer.innerHTML = `
      <h3>Order Summary</h3>
      <div class="subtotal">
        <h3>Subtotal:</h3>
        <div>$${formatPrice(totalPrice)}</div>
      </div>
      <div class="shipping">
        <h3>Estimated Shipping:</h3>
        <div>FREE</div>
      </div>
      <div class="tax">
        <h3>Estimated Tax</h3>
        <div>$${formatPrice(totalPrice * 0.08)}</div>
      </div>
      <div class="total">
        <h3>Estimated Total</h3>
        <div>$${formatPrice(totalPrice * 1.08)}</div>
      </div>
      <div>
        <button class="checkout-btn">Checkout</button>
      </div>
    `;
  }
};

const updateQuantity = async (event) => {
  let quanVal = parseInt(event.target.value);
  if (isNaN(quanVal) || quanVal < 1) {
    quanVal = 1;
    event.target.value = 1;
  }

  const prod = event.target.closest('.product-in-cart');
  const prodId = parseInt(prod.getAttribute('data-id'));

  // Gọi API backend để cập nhật số lượng
  const token = localStorage.getItem("token");
  await fetch(`http://localhost:3000/api/cart/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      productId: prodId,
      quantity: quanVal
    })
  });

  // Cập nhật lại UI sau khi API trả về thành công
  calculateTotal();
};

const removeItem = async (event) => {
  const prodRemove = event.target.closest('.product-in-cart').getAttribute('data-id');

  const token = localStorage.getItem("token");
  await fetch(`http://localhost:3000/api/cart/delete/${prodRemove}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  event.target.closest('.product-in-cart').remove();

  // Kiểm tra nếu giỏ hàng trống
  const cartGrid = document.querySelector('.cart-items');
  if (cartGrid.children.length === 0) {
    cartGrid.innerHTML = '<h2>Your cart is empty</h2>';
  }

  calculateTotal();
};

document.addEventListener('DOMContentLoaded', () => {
  const API_URL = "http://localhost:3000/api/cart";
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Vui lòng đăng nhập để xem giỏ hàng.");
    return;
  }

  fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      items = data.cart || [];

      const isCartPage = window.location.pathname.includes('cart.html');
      if (!isCartPage) return;

      const cartGrid = document.querySelector('.cart-items');
      if (items.length === 0) {
        cartGrid.innerHTML = '<h2>Your cart is empty</h2>';
        calculateTotal();
      } else {
        cartGrid.innerHTML = '';
        items.forEach(item => {
          const productHTML = `
            <div class="product-in-cart" data-id="${item.product_id}">
              <div class="product-in-cart-left">
                <img src="${item.image_url}" alt="${item.productName}">
                <div class="product-info">
                  <p>${item.productName}</p>
                  <p>Item #: ${item.product_id}</p>
                </div>
              </div>
              <div class="product-in-cart-right">
                <div>
                  <p>Each</p>
                  <div class="price" data-unit-price="${item.price}">$${item.price}</div>
                </div>
                <div class="quantity">
                  <label for="quantity-${item.product_id}">Qty:</label>
                  <input 
                    type="number" 
                    class="quantity-input" 
                    id="quantity-${item.product_id}" 
                    value="${item.quantity}" 
                    min="1"
                  />
                </div>
                <i class="fa-solid fa-x"></i>
              </div>
            </div>
          `;
          cartGrid.insertAdjacentHTML('beforeend', productHTML);
        });

        document.querySelectorAll('.fa-x').forEach(btn => {
          btn.addEventListener('click', removeItem);
        });

        calculateTotal();
      }
    })
    .catch(err => {
      console.error("Error loading cart:", err);
      alert("Không thể tải giỏ hàng.");
    });
});

document.addEventListener('input', event => {
  if (event.target.classList.contains('quantity-input')) {
    updateQuantity(event);
  }
});

document.addEventListener('click', async event => {
  if (event.target.classList.contains('checkout-btn')) {
    const token = localStorage.getItem("token");

    // Xoá giỏ hàng từ DB
    await fetch(`http://localhost:3000/api/cart/clear`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Làm sạch UI sau khi thanh toán
    const cartContainer = document.querySelector('.cart-items');
    cartContainer.innerHTML = `
      <div class="checkout-success">
        <h2>🎉 Checkout Successful!</h2>
        <p>Thank you for your purchase.</p>
      </div>
    `;

    const pricingContainer = document.querySelector('.pricing-container');
    if (pricingContainer) {
      pricingContainer.innerHTML = '';
    }

    setTimeout(() => {
      window.location.reload();
    }, 3000);
  }
});
