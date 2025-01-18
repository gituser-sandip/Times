/*JS code for image slider*/
const slider = document.querySelector('.slider');
const prev = document.getElementById('prev');
const next = document.getElementById('next');
const dotsContainer = document.getElementById('dots');
const items = document.querySelectorAll('.watch-item');

/*Code to show number of pictures per slide*/
const itemsPerView = 4;
let currentIndex = 0;
const totalItems = items.length;

// Calculate the total number of "views" based on the items per view
const totalViews = totalItems <= itemsPerView ? 1 : totalItems - itemsPerView + 1;

// Check if there are enough items to create the slider (safety check)
if (totalItems < 1) {
  console.warn("Not enough items to create a valid slider.");
}

// to create dots based on number of images
for (let i = 0; i < totalViews; i++) {
  const dot = document.createElement('div');
  dot.classList.add('dot');
  dot.addEventListener('click', () => showView(i));
  dotsContainer.appendChild(dot);
}

// to show atleast one dot 
const dots = document.querySelectorAll('.dot');
dots[0].classList.add('active');

// Update the visibility of navigation buttons based on current index
function updateButtons() {
  prev.style.display = (currentIndex > 0) ? 'flex' : 'none';
  next.style.display = (currentIndex < totalViews - 1) ? 'flex' : 'none';
}

// Show a specific view based on the index
function showView(index) {
  if (index >= totalViews || index < 0) {
    return;  // Ignore out of range indexes
  }

  // Update current index and translate the slider
  currentIndex = index;
  slider.style.transform = `translateX(${-currentIndex * (100 / itemsPerView)}%)`;

  // Update active dot and buttons
  dots.forEach(dot => dot.classList.remove('active'));
  dots[currentIndex].classList.add('active');
  updateButtons();
}

// Event listeners for the previous and next buttons
prev.addEventListener('click', () => showView(currentIndex - 1));
next.addEventListener('click', () => showView(currentIndex + 1));

// Initialize slider view
showView(0);
updateButtons();