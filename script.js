const bubbleCycle = document.getElementById("bubbleCycle");

if (bubbleCycle) {
  const slides = bubbleCycle.querySelectorAll(".bubble-slide");
  let current = 0;

  setInterval(() => {
    slides[current].classList.remove("is-active");
    current = (current + 1) % slides.length;
    slides[current].classList.add("is-active");
  }, 2800);
}

const list = document.getElementById("featureList");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

if (list && prevBtn && nextBtn) {
  const cards = Array.from(list.querySelectorAll(".feature-card"));
  let activeIndex = 0;

  function render(shouldScroll) {
    cards.forEach((card, i) => {
      card.classList.toggle("feature-card--primary", i === activeIndex);
    });

    prevBtn.disabled = activeIndex === 0;
    nextBtn.disabled = activeIndex === cards.length - 1;

    if (shouldScroll) {
      cards[activeIndex].scrollIntoView({
        behavior: "smooth",
        inline: "start",
        block: "nearest",
      });
    }
  }

  function goTo(index) {
    activeIndex = Math.min(Math.max(index, 0), cards.length - 1);
    render(true);
  }

  prevBtn.addEventListener("click", () => goTo(activeIndex - 1));
  nextBtn.addEventListener("click", () => goTo(activeIndex + 1));

  render(false);
}
