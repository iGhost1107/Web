(function() {
    const header = document.querySelector("header");


window.addEventListener("scroll", function(){
    header.classList.toggle ("sticky", window.scrollY > 0);
})


let menu = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');


menu.onclick = () => {
    menu.classList.toggle('bx-x');
    navbar.classList.toggle('open');
};


// less 

window.onscroll = () => {
    menu.classList.remove('bx-x');
    navbar.classList.remove('open');
};


const sr = ScrollReveal ({
    distance: '60px',
    duration: 2500,
    delay: 400,
    reset: true
})

sr.reveal('.home-text', {delay: 200, origin: 'top'});
sr.reveal('.home-img', {delay: 300, origin: 'top'});
sr.reveal('.feature, .product, cta.content, .contact', {delay: 200, origin: 'top'});


// Swiper
// const swiper = new Swiper(".swiper", {
//     // How many slides to show
//     slidesPerView: 1,
//     // How much space between slides
//     spaceBetween: 20,
//     // Make the next and previous buttons work
//     navigation: {
//         nextEl: '.swiper-button-next',
//         prevEl: '.swiper-button-prev',
//     },
//     // Make the pagination indicators work
//     pagination: {
//         el: '.swiper-pagination'
//     },
//     //Responsive breakpoints for how many slides to show at that view
//     breakpoints: {
//         // 700px and up shoes 2 slides
//         700: {
//           slidesPerView: 2
//         },
//         // 1200px and up shoes 3 slides
//         1200: {
//             slidesPerView: 3
//         }
//     }   
// });

})();

