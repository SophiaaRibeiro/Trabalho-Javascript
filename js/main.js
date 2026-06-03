const themeToggle =
    document.getElementById('themeToggle');

const icon =
    themeToggle?.querySelector('i');

const savedTheme =
    localStorage.getItem('theme');


// aplica tema salvo
if (savedTheme === 'dark') {

    document.documentElement.setAttribute(
        'data-theme',
        'dark'
    );

    if (icon) {

        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');

    }

}


if (themeToggle) {

    themeToggle.addEventListener('click', () => {

        const currentTheme =
            document.documentElement.getAttribute('data-theme');

        // DARK -> LIGHT
        if (currentTheme === 'dark') {

            document.documentElement.setAttribute(
                'data-theme',
                'light'
            );

            localStorage.setItem(
                'theme',
                'light'
            );

            if (icon) {

                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');

            }

        }

        // LIGHT -> DARK
        else {

            document.documentElement.setAttribute(
                'data-theme',
                'dark'
            );

            localStorage.setItem(
                'theme',
                'dark'
            );

            if (icon) {

                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');

            }

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
