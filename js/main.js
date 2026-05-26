// DARK MODE

const themeToggle =
    document.getElementById('themeToggle');

// TEMA SALVO


const savedTheme =
    localStorage.getItem('theme');


// aplica ao carregar
if (savedTheme === 'dark') {

    document.documentElement.setAttribute(
        'data-theme',
        'dark'
    );

}

// TOGGLE


if (themeToggle) {

    themeToggle.addEventListener('click', () => {

        const currentTheme =
            document.documentElement.getAttribute('data-theme');

        // DARK
        if (currentTheme === 'dark') {

            document.documentElement.setAttribute(
                'data-theme',
                'light'
            );

            localStorage.setItem(
                'theme',
                'light'
            );

        }

        // LIGHT
        else {

            document.documentElement.setAttribute(
                'data-theme',
                'dark'
            );

            localStorage.setItem(
                'theme',
                'dark'
            );

        }

    });

}

// MENU MOBILE

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
