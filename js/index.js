//main home page image slider ------------------------------------------------------------------------------

let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}


// automatically show slides


function showSlides() {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}
  slides[slideIndex-1].style.display = "block";
  setTimeout(showSlides, 3000); // Change image every 3 seconds
}

// highlight products secction---------------------------------------------------------------------------------------------------------
 //Image slider buttons
 const slider = document.querySelector('.p_slider');
 const prev = document.getElementById('p_prev');
 const next = document.getElementById('p_next');
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
     dot.onclick = () => showView(i);
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

 prev.onclick = () => showView(currentIndex - 1);
 next.onclick = () => showView(currentIndex + 1);

 showView(0);
 updateButtons();