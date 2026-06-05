
const favoritesContainer =
    document.querySelector('.cards-grid');

const favoritesCount =
    document.querySelector('.fav-count strong');


let favorites =
    JSON.parse(localStorage.getItem('favorites')) || [];


function renderFavorites() {

    if (!favoritesContainer) return;

    favoritesContainer.innerHTML = '';    

    if (favorites.length === 0) {

        favoritesContainer.innerHTML = `

            <div class="fav-empty">

                <div class="big-icon">
                    ❤️
                </div>

                <h3>
                    Nenhum favorito salvo
                </h3>

                <p>
                    Explore o cardápio e salve seus cafés favoritos.
                </p>

            </div>

        `;

        if (favoritesCount) {

            favoritesCount.textContent =
                '0 cafés favoritos';

        }

        return;

    }

   

    if (favoritesCount) {

        favoritesCount.textContent =
            `${favorites.length} cafés favoritos`;

    }

    
   
    favorites.forEach((product, index) => {

        const card =
            document.createElement('article');

        card.classList.add('coffee-card');

        card.innerHTML = `

            <img
                src="${product.image}"
                class="card-img"
            >

            <div class="card-body">

                <span class="tag ${product.tagClass}">
                    ${product.tag}
                </span>

                <h3 class="card-name">
                    ${product.name}
                </h3>

                <p class="card-desc">
                    ${product.desc}
                </p>

                <div class="card-footer">

                    <span class="card-price">
                        ${product.price}
                    </span>

                    <button
                        class="btn-clear-fav"
                        data-index="${index}"
                    >
                        Remover
                    </button>

                </div>

            </div>

        `;

        favoritesContainer.appendChild(card);

    });

    addRemoveEvents();

}


function addRemoveEvents() {

    const removeButtons =
        document.querySelectorAll('.btn-clear-fav');

    removeButtons.forEach(button => {

        button.addEventListener('click', () => {

            const index = button.dataset.index;

            favorites.splice(index, 1);

            localStorage.setItem(
                'favorites',
                JSON.stringify(favorites)
            );

            renderFavorites();

            showToast('Favorito removido 💔');

        });

    });

}



function showToast(message) {

    let container =
        document.getElementById('toast-container');

    if (!container) {

        container =
            document.createElement('div');

        container.id = 'toast-container';

        document.body.appendChild(container);

    }

    const toast =
        document.createElement('div');

    toast.classList.add('toast');

    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {

        toast.remove();

    }, 3000);

}


renderFavorites();
