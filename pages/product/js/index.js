/*JS code for image slider*/
const slider = document.querySelector('.slider');
const prev = document.getElementById('prev');
const next = document.getElementById('next');
const dotsContainer = document.getElementById('dots');
const items = document.querySelectorAll('.watch-item');

/*Code to show number of pictures per slide*/
const itemsPerView = 4;
let currentIndex = 0;

/*Code to show total number of pictures*/
const totalItems = items.length;
const totalViews = totalItems - itemsPerView + 1;

/*To create dots based on the number of images*/
for (let i = 0; i < totalViews; i++) {
  const dot = document.createElement('div');
  dot.classList.add('dot');
  dot.onclick = () => showView(i);
  dotsContainer.appendChild(dot);
}

/*to show atleast one dot*/
const dots = document.querySelectorAll('.dot');
dots[0].classList.add('active');

/*To hide and show the previous and next buttons*/
function updateButtons() {
  prev.style.display = (currentIndex > 0) ? 'flex' : 'none';
  next.style.display = (currentIndex < totalViews - 1) ? 'flex' : 'none';
}

/* Show a specific view based on the index*/
function showView(index) {
  if (index >= totalViews || index < 0) {
    return;  /*Ignore out of range indexes*/
  }

  /*Update the current index and sliding the image based on itemsPerviw*/
  currentIndex = index;
  slider.style.transform = `translateX(${-currentIndex * (100 / itemsPerView)}%)`;

 /*To highligh the active dot */
  dots.forEach(dot => dot.classList.remove('active'));
  dots[currentIndex].classList.add('active');
  updateButtons();
}

/*To show the previous and next images when the button's are pressed*/
prev.onclick = () => showView(currentIndex - 1);
next.onclick = () => showView(currentIndex + 1);

/*Initialize slider view*/
showView(0);
updateButtons();