//Burger menu
var navMain = document.querySelector('.main-nav');
var navToggle = document.querySelector('.main-nav__toggle');
const links = document.querySelectorAll('.site-list__item');
const userLinks = document.querySelectorAll('.user-list__item');

const toggleMenu = () => {
  if (navMain.classList.contains('main-nav--closed')) {
    navMain.classList.remove('main-nav--closed');
    navMain.classList.add('main-nav--opened');
  } else {
    navMain.classList.add('main-nav--closed');
    navMain.classList.remove('main-nav--opened');
  }
  toggleLinks();
}

navToggle.addEventListener('click', toggleMenu);

const toggleLinks = () => {
  if (navMain.classList.contains('main-nav--opened')) {
    links.forEach(link => link.addEventListener ('click', toggleMenu));
    userLinks.forEach(link => link.addEventListener ('click', toggleMenu));
  } else {
    links.forEach(link => link.removeEventListener ('click', toggleMenu));
    userLinks.forEach(link => link.removeEventListener ('click', toggleMenu));
  }
};
