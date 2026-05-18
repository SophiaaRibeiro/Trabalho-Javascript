const themeToggle = document.getElementById('themeToggle');

themeToggle.addEventListener('click', () => {

    const html = document.documentElement;
    const icon = themeToggle.querySelector('i');

    if (html.getAttribute('data-theme') === 'light') {

        html.setAttribute('data-theme', 'dark');

        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');

    } else {

        html.setAttribute('data-theme', 'light');

        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');

    }

});

// =========================
// MENU MOBILE
// =========================

const menuButton = document.getElementById('menuMobile');

const navLinks = document.getElementById('nav-links');

const menuOverlay = document.getElementById('menuOverlay');

if(menuButton){

    menuButton.addEventListener('click', () => {

        navLinks.classList.toggle('active');       

    });

}

// fechar clicando fora

if(menuOverlay){

    menuOverlay.addEventListener('click', () => {

        navLinks.classList.remove('active');

        menuOverlay.classList.remove('active');

    });

}