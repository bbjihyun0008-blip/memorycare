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

if (list) {
  const cards = Array.from(list.querySelectorAll(".feature-card"));
  let activeIndex = 0;
  const slider = document.getElementById("featureSlider");

  const listWrap = list.parentElement; // features__content
  
  function render() {
    // 1. 활성 카드 CSS 업데이트
    cards.forEach((card, i) => {
      card.classList.toggle("feature-card--primary", i === activeIndex);
    });
    
    // 2. 하단 슬라이더 업데이트
    if (slider) {
      slider.value = activeIndex;
    }
    
    // 3. 브라우저 스크롤 버그(페이지 이동 등) 원천 차단!
    // transform: translateX를 사용하여 물리적으로 카드 영역(트랙)만 부드럽게 이동시킵니다.
    const targetCard = cards[activeIndex];
    const wrapCenter = listWrap.clientWidth / 2;
    // 카드의 중심 좌표
    const cardCenter = targetCard.offsetLeft + (targetCard.offsetWidth / 2);
    // 화면 중앙에 오기 위해 이동해야 할 X 거리
    const translateX = wrapCenter - cardCenter;
    
    list.style.transform = `translateX(${translateX}px)`;
  }

  function goTo(index) {
    activeIndex = Math.min(Math.max(index, 0), cards.length - 1);
    render();
  }

  if (slider) {
    slider.addEventListener("input", (e) => {
      goTo(parseInt(e.target.value, 10));
    });
  }

  // 카드 클릭 시 이동
  cards.forEach((card, index) => {
    card.addEventListener("click", (e) => {
      goTo(index);
    });
  });

  // 트랙패드 및 마우스 휠 스와이프 지원
  let isWheelCooldown = false;
  let wheelTimeout;
  
  listWrap.addEventListener('wheel', (e) => {
    // 수직 스크롤은 브라우저 기본 동작 허용
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) return;
    
    // 수평 스크롤일 경우 스와이프 페이지 이동 차단
    e.preventDefault();
    
    if (isWheelCooldown) return;
    
    if (e.deltaX > 20) {
      goTo(activeIndex + 1);
      triggerCooldown();
    } else if (e.deltaX < -20) {
      goTo(activeIndex - 1);
      triggerCooldown();
    }
  }, { passive: false });

  function triggerCooldown() {
    isWheelCooldown = true;
    clearTimeout(wheelTimeout);
    wheelTimeout = setTimeout(() => {
      isWheelCooldown = false;
    }, 600);
  }

  // 모바일 터치 스와이프 및 마우스 드래그 지원
  let startX = 0;
  let isDown = false;
  
  list.addEventListener('dragstart', (e) => e.preventDefault());
  
  function handleStart(clientX) {
    startX = clientX;
    isDown = true;
  }
  
  function handleEnd(clientX) {
    if (!isDown) return;
    isDown = false;
    const diff = startX - clientX;
    if (diff > 40) {
      goTo(activeIndex + 1);
    } else if (diff < -40) {
      goTo(activeIndex - 1);
    }
  }

  // 터치 이벤트
  listWrap.addEventListener('touchstart', (e) => handleStart(e.touches[0].clientX), { passive: true });
  listWrap.addEventListener('touchend', (e) => handleEnd(e.changedTouches[0].clientX));
  
  // 마우스 이벤트
  listWrap.addEventListener('mousedown', (e) => handleStart(e.clientX));
  window.addEventListener('mouseup', (e) => handleEnd(e.clientX));

  // 창 크기 변경 시 위치 재계산
  window.addEventListener('resize', () => {
    render();
  });

  // 초기 렌더링
  render();
}
