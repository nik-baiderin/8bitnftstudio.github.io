const swiper = new Swiper(".swiper", {
  direction: "horizontal",
  pagination: {
    el: ".swiper-pagination",
  },
  // And if we need scrollbar
  scrollbar: {
    el: ".swiper-scrollbar",
  },
  navigation: {
    nextEl: ".onboarding_slider_next",
  },
});
window.swiper = swiper;

document
  .querySelector(".onboarding_skip_btn")
  .addEventListener("click", (e) => {
    swiper.slideTo(4);
  });
