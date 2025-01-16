//Image slider buttons
const slider = document.querySelector('.slider');
const prev = document.getElementById('prev');
const next = document.getElementById('next');
const dotsContainer = document.getElementById('dots');
const items = document.querySelectorAll('.watch-item');
const itemsPerView = 4;
let currentIndex = 0;

const totalItems = items.length;
const totalViews = totalItems - itemsPerView + 1;

// Create dots
for (let i = 0; i < totalViews; i++) {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    dot.addEventListener('click', () => showView(i));
    dotsContainer.appendChild(dot);
}

const dots = document.querySelectorAll('.dot');
dots[0].classList.add('active');

function updateButtons() {
    prev.style.display = (currentIndex > 0) ? 'flex' : 'none';
    next.style.display = (currentIndex < totalViews - 1) ? 'flex' : 'none';
}

function showView(index) {
    if (index >= totalViews || index < 0) {
        return;
    }

    currentIndex = index;

    slider.style.transform = `translateX(${-currentIndex * (100 / itemsPerView)}%)`;
    
    dots.forEach(dot => dot.classList.remove('active'));
    dots[currentIndex].classList.add('active');

    updateButtons();
}

prev.addEventListener('click', () => showView(currentIndex - 1));
next.addEventListener('click', () => showView(currentIndex + 1));

showView(0);
updateButtons();