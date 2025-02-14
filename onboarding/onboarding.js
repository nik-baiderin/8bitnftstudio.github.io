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
  spaceBetween: 30,
});
window.swiper = swiper;

// document
//   .querySelector(".onboarding_skip_btn")
//   .addEventListener("click", (e) => {
//     swiper.slideTo(4);
//   });

document
  .querySelector(".onboarding_slider_play")
  .addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelector("#finishOnboarding").click();
  });
