'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(function (btn) {
  btn.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//Smooth Scrolling
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function () {
  section1.scrollIntoView({ behavior: 'smooth' });
});

//Old and complex method to implement smooth scrolling
// btnScrollTo.addEventListener('click', function () {
//   const sect1Coordinates = section1.getBoundingClientRect();
//   console.log(sect1Coordinates);

//   window.scrollTo({
//     left: 0,
//     top: sect1Coordinates.top,
//     behavior: 'smooth',
//   });
// });

//Page Navigation using Event Delegation
const nav_linksParent = document.querySelector('.nav__links');

nav_linksParent.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    e.target.classList.contains('nav__link') &&
    e.target.classList.length === 1
  ) {
    document
      .querySelector(e.target.getAttribute('href'))
      .scrollIntoView({ behavior: 'smooth' });
  }
});

//Tabbed Component
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', function (e) {
  const clickedTab = e.target.closest('.operations__tab');
  if (clickedTab) {
    tabs.forEach(function (tab) {
      tab.classList.remove('operations__tab--active');
    });
    clickedTab.classList.add('operations__tab--active');

    //Change the content accordingly
    tabsContent.forEach(function (tabContent) {
      tabContent.classList.remove('operations__content--active');
    });

    tabsContent[Number(clickedTab.dataset.tab) - 1].classList.add(
      'operations__content--active'
    );
  }
});

//Menu facde when hover
const nav = document.querySelector('.nav');
const nav_links = document.querySelectorAll('.nav__link');
const nav_logo = document.querySelector('.nav__logo');

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const currentLink = e.target;
    nav_links.forEach(function (link) {
      if (link !== currentLink) {
        link.style.opacity = this;
      }
    }, this);
    nav_logo.style.opacity = this;
  }
};

//When hovered onto the element
nav.addEventListener('mouseover', handleHover.bind(0.5));
//When hovered out of the element
nav.addEventListener('mouseout', handleHover.bind(1));

//Sticky Navigation

//Method1: Using the scroll event (Inefficient Method)
// const limit =
//   section1.getBoundingClientRect().top - nav.getBoundingClientRect().height;
// window.addEventListener('scroll', function (e) {
//   if (pageYOffset >= limit) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

//Method2: Using IntersectionObserver API (Efficient Method)
const header = document.querySelector('.header');
const headerObserver = new IntersectionObserver(
  function (entries) {
    const [entry] = entries;
    if (!entry.isIntersecting) nav.classList.add('sticky');
    else nav.classList.remove('sticky');
  },
  {
    root: null,
    threshold: 0,
    rootMargin: `-${nav.getBoundingClientRect().height}px`,
  }
);
headerObserver.observe(header);

//Revealing Elements on Scroll
const sections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (entry.isIntersecting) {
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  }
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

sections.forEach(function (section) {
  section.classList.add('section--hidden');
  sectionObserver.observe(section);
});

//Slider Component
const slider = function () {
  //Elements
  const slider = document.querySelector('.slider');
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotsContainer = document.querySelector('.dots');
  const maxSlide = slides.length;
  const minSlide = 0;
  let currSlide = 0;

  //Functions
  const goToSlide = function (currentSlide) {
    slides.forEach(function (slide, index) {
      slide.style.transform = `translateX(${(index - currentSlide) * 100}%)`;
    });
  };

  const showNextSlide = function () {
    if (currSlide === maxSlide - 1) currSlide = 0;
    else currSlide++;
    goToSlide(currSlide);
    activateDot(currSlide);
  };

  const showPrevSlide = function () {
    if (currSlide === 0) currSlide = maxSlide - 1;
    else currSlide--;
    goToSlide(currSlide);
    activateDot(currSlide);
  };

  const createDots = function () {
    slides.forEach(function (_, i) {
      dotsContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document.querySelectorAll('.dots__dot').forEach(function (dot) {
      dot.classList.remove('dots__dot--active');
    });
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };

  init();

  //Event Listeners
  btnRight.addEventListener('click', showNextSlide);
  btnLeft.addEventListener('click', showPrevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.code === 'ArrowRight') showNextSlide();
    if (e.code === 'ArrowLeft') showPrevSlide();
  });

  dotsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      currSlide = e.target.dataset.slide;
      goToSlide(currSlide);
      activateDot(currSlide);
    }
  });
};
slider();

//Lazy loading images
const images = document.querySelectorAll('.features__img');
const imageObserver = new IntersectionObserver(
  function (entries, observer) {
    const [entry] = entries;
    console.log(entry);
    if (entry.isIntersecting) {
      entry.target.setAttribute('src', entry.target.dataset.src);
      entry.target.classList.remove('lazy-img');
      observer.unobserve(entry.target);
    }
  },
  {
    root: null,
    threshold: 0.2,
  }
);

images.forEach(function (image) {
  imageObserver.observe(image);
});

// //DOM Section

// //Selecting, Creating and Deleting HTML Elements
// console.log(document.documentElement);

// console.log(document.querySelector('.section'));

// const allSections = document.querySelectorAll('.section');
// console.log(allSections);

// //Inserting elements

// //1).insertAdjacentHtml
// const message = document.createElement('div');
// message.classList.add('cookie-message');
// // message.textContent = 'We use cookie for improved functionality and analytics';
// message.innerHTML =
//   "We use cookie for improved functionality and analytics <button class='btn btn--close-cookie'>Got it!</button>";

// const header = document.querySelector('.header');
// header.append(message);

// //Delete Elements
// const cookieBtn = document.querySelector('.btn--close-cookie');
// cookieBtn.addEventListener('click', function () {
//   message.remove();
// });

// //Styles,Attributes, Classes Lecture

// //Styles
// message.style.backgroundColor = 'red';
// message.style.width = '130%';

// //Events in JS
// const h1 = document.querySelector('h1');

// const changeColorRed = function () {
//   alert('EVENT LISTENER present');

//   this.removeEventListener('mouseenter', changeColorRed);
// };

// h1.addEventListener('mouseenter', changeColorRed);

//Intersection Observer API Practise
// const obsOptions = {
//   root: null,
//   threshold: 0.1,
// };
// const obsCallBack = function (entries, observer) {
//   entries.forEach(function (entry) {
//     console.log(entry);
//   });
// };
// const observer = new IntersectionObserver(obsCallBack, obsOptions);

//Lifecycle DOM Events
// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   e.returnValue = '';
// });
