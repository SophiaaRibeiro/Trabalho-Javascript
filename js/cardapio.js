
// FILTROS
const chips = document.querySelectorAll('.chip');
const cards = document.querySelectorAll('.coffee-card');

if (chips.length > 0) {

    chips.forEach(chip => {

        chip.addEventListener('click', () => {

            chips.forEach(btn =>
                btn.classList.remove('active')
            );

            chip.classList.add('active');

            const category =
                chip.dataset.filter;

            cards.forEach(card => {

                const tag =
                    card.dataset.category;

                if (category === 'todos') {

                    card.style.display = 'block';
                    return;

                }

                if (tag === category) {

                    card.style.display = 'block';

                } else {

                    card.style.display = 'none';

                }

            });

        });

    });

}

// PESQUISA

const searchInput = document.querySelector('.search-wrap input');

if (searchInput) {

    searchInput.addEventListener('input', () => {

        const value = searchInput.value.toLowerCase();

        cards.forEach(card => {

            const coffeeName = card.querySelector('.card-name')
                .textContent
                .toLowerCase();

            if (coffeeName.includes(value)) {

                card.style.display = 'block';

            } else {

                card.style.display = 'none';

            }

        });

    });

}

// CARRINHO

const orderButtons = document.querySelectorAll('.btn-primary');

if (orderButtons.length > 0) {

    orderButtons.forEach(button => {

        button.addEventListener('click', (event) => {

            const card = button.closest('.coffee-card');

            // impede erro em páginas sem card
            if (!card) return;

            event.preventDefault();

            const coffeeName =
                card.querySelector('.card-name').textContent;

            const coffeePrice =
                card.querySelector('.card-price').textContent;

            const coffeeImage =
                card.querySelector('.card-img').src;

            const product = {
                name: coffeeName,
                price: coffeePrice,
                image: coffeeImage,
                quantity: 1
            };

            let cart =
                JSON.parse(localStorage.getItem('cart')) || [];

            const existingProduct = cart.find(
                item => item.name === product.name
            );

            if (existingProduct) {

                existingProduct.quantity++;

            } else {

                cart.push(product);

            }

            localStorage.setItem(
                'cart',
                JSON.stringify(cart)
            );

            showToast('Produto adicionado ao carrinho ☕');

            // setTimeout(() => {

            //     window.location.href =
            //         '../pages/carrinho.html';

            // }, 1200);

        });

    });

}

// ======================
// FAVORITOS
// ======================

const favButtons =
    document.querySelectorAll('.btn-fav');


// ======================
// PEGAR FAVORITOS
// ======================

let favorites =
    JSON.parse(
        localStorage.getItem('favorites')
    ) || [];


// ======================
// VERIFICAR FAVORITOS
// ======================

favButtons.forEach(button => {

    const card =
        button.closest('.coffee-card');

    if (!card) return;

    const coffeeName =
        card.querySelector('.card-name')
        .textContent;

    const icon =
        button.querySelector('i');

    const exists = favorites.find(
        item => item.name === coffeeName
    );

    // já favoritado
    if (exists) {

        button.classList.add('active');

        icon.classList.remove('fa-regular');
        icon.classList.add('fa-solid');

    }

});


// ======================
// EVENTO FAVORITAR
// ======================

if (favButtons.length > 0) {

    favButtons.forEach(button => {

        button.addEventListener('click', () => {

            const usuarioLogado = getUsuarioLogado ? getUsuarioLogado() : null;

            if (!usuarioLogado) {
                showToast('Faça login para favoritar ☕');
                setTimeout(() => {
                    window.location.href = '../pages/login.html';
                }, 1500);
                return;
            }

            const icon =
                button.querySelector('i');

            button.classList.toggle('active');

            const card =
                button.closest('.coffee-card');

            if (!card) return;

            const product = {

                name:
                    card.querySelector('.card-name')
                    .textContent,

                price:
                    card.querySelector('.card-price')
                    .textContent,

                image:
                    card.querySelector('.card-img')
                    .src,

                tag:
                    card.querySelector('.tag')
                    .textContent,

                desc:
                    card.querySelector('.card-desc')
                    .textContent,

                tagClass:
                    card.querySelector('.tag')
                    .classList[1]

            };

            // ======================
            // ADICIONAR
            // ======================

            if (button.classList.contains('active')) {

                icon.classList.remove('fa-regular');
                icon.classList.add('fa-solid');

                const exists = favorites.find(
                    item => item.name === product.name
                );

                if (!exists) {

                    favorites.push(product);

                }

                showToast(
                    'Adicionado aos favoritos ❤️'
                );

            }

            // ======================
            // REMOVER
            // ======================

            else {

                icon.classList.remove('fa-solid');
                icon.classList.add('fa-regular');

                favorites = favorites.filter(
                    item => item.name !== product.name
                );

                showToast(
                    'Removido dos favoritos 💔'
                );

            }

            // salva
            localStorage.setItem(
                'favorites',
                JSON.stringify(favorites)
            );

        });

    });

}

// TOAST

function showToast(message) {

    const container =
        document.getElementById('toast-container');

    if (!container) return;

    const toast = document.createElement('div');

    toast.classList.add('toast');

    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {

        toast.remove();

    }, 3000);

}