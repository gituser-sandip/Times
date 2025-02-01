// Image slider buttons for the second slider
const slider2 = document.querySelector('#slider2');
const prev2 = document.getElementById('prev2');
const next2 = document.getElementById('next2');
const dotsContainer2 = document.getElementById('dots2');
const items2 = slider2.querySelectorAll('.watch-item');
const itemsPerView2 = 4;
let currentIndex2 = 0;

const totalItems2 = items2.length;
const totalViews2 = totalItems2 - itemsPerView2 + 1;

// Create dots for the second slider
for (let i = 0; i < totalViews2; i++) {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    dot.onclick = () => showView2(i);
    dotsContainer2.appendChild(dot);
}

const dots2 = dotsContainer2.querySelectorAll('.dot');
dots2[0].classList.add('active');

function updateButtons2() {
    prev2.style.display = (currentIndex2 > 0) ? 'flex' : 'none';
    next2.style.display = (currentIndex2 < totalViews2 - 1) ? 'flex' : 'none';
}

function showView2(index) {
    if (index >= totalViews2 || index < 0) {
        return;
    }

    currentIndex2 = index;

    slider2.style.transform = `translateX(${-currentIndex2 * (100 / itemsPerView2)}%)`;

    dots2.forEach(dot => dot.classList.remove('active'));
    dots2[currentIndex2].classList.add('active');

    updateButtons2();
}

prev2.onclick = () => showView2(currentIndex2 - 1);
next2.onclick = () => showView2(currentIndex2 + 1);

showView2(0);
updateButtons2();
