// ======================
// VERIFICA SE É A PÁGINA DO CARRINHO
// ======================

const cartContainer = document.querySelector('.cart-items');

if (!cartContainer) {

    console.log('Página sem carrinho');

} else {

    // ======================
    // ELEMENTOS
    // ======================

    const subtotalElement =
        document.querySelectorAll('.summary-row span')[1];

    const totalElement =
        document.querySelector('.summary-total strong');


    // ======================
    // PEGAR CARRINHO
    // ======================

    let cart =
        JSON.parse(localStorage.getItem('cart')) || [];


    // ======================
    // RENDERIZAR CARRINHO
    // ======================

    function renderCart() {

        cartContainer.innerHTML = `

            <div>
                <a href="/pages/cardapio.html" class="btn-close">
                    Voltar
                </a>
            </div>

        `;

        let subtotal = 0;

        // carrinho vazio
        if (cart.length === 0) {

            cartContainer.innerHTML += `

                <div class="empty-state">

                    <div class="empty-icon">
                        🛒
                    </div>

                    <p>
                        Seu carrinho está vazio
                    </p>

                </div>

            `;

            if (subtotalElement) {
                subtotalElement.textContent = 'R$ 0';
            }

            if (totalElement) {
                totalElement.textContent = 'R$ 0';
            }

            return;

        }

        // renderiza produtos
        cart.forEach((product, index) => {

            const priceNumber = Number(
                product.price
                    .replace('R$', '')
                    .trim()
            );

            subtotal +=
                priceNumber * product.quantity;

            const item =
                document.createElement('article');

            item.classList.add('cart-product');

            item.innerHTML = `

                <img
                    src="${product.image}"
                    class="cart-product-img"
                >

                <div class="cart-product-info">

                    <h3 class="cart-product-name">
                        ${product.name}
                    </h3>

                    <p class="cart-product-desc">
                        Café especial selecionado.
                    </p>

                    <div class="cart-product-actions">

                        <div class="quantity-control">

                            <button
                                class="decrease"
                                data-index="${index}"
                            >
                                -
                            </button>

                            <span>
                                ${product.quantity}
                            </span>

                            <button
                                class="increase"
                                data-index="${index}"
                            >
                                +
                            </button>

                        </div>

                        <button
                            class="remove-item"
                            data-index="${index}"
                        >
                            Remover
                        </button>

                    </div>

                </div>

                <div class="cart-product-price">
                    R$ ${priceNumber * product.quantity}
                </div>

            `;

            cartContainer.appendChild(item);

        });

        // resumo
        if (subtotalElement) {
            subtotalElement.textContent = `R$ ${subtotal}`;
        }

        const total = subtotal + 8;

        if (totalElement) {
            totalElement.textContent = `R$ ${total}`;
        }

        addCartEvents();

    }


    // ======================
    // EVENTOS
    // ======================

    function addCartEvents() {

        // aumentar
        const increaseButtons =
            document.querySelectorAll('.increase');

        increaseButtons.forEach(button => {

            button.addEventListener('click', () => {

                const index = button.dataset.index;

                cart[index].quantity++;

                updateCart();

            });

        });

        // diminuir
        const decreaseButtons =
            document.querySelectorAll('.decrease');

        decreaseButtons.forEach(button => {

            button.addEventListener('click', () => {

                const index = button.dataset.index;

                if (cart[index].quantity > 1) {

                    cart[index].quantity--;

                } else {

                    cart.splice(index, 1);

                }

                updateCart();

            });

        });

        // remover
        const removeButtons =
            document.querySelectorAll('.remove-item');

        removeButtons.forEach(button => {

            button.addEventListener('click', () => {

                const index = button.dataset.index;

                cart.splice(index, 1);

                updateCart();

            });

        });

    }


    // ======================
    // UPDATE
    // ======================

    function updateCart() {

        localStorage.setItem(
            'cart',
            JSON.stringify(cart)
        );

        renderCart();

    }


    // ======================
    // INICIAR
    // ======================

    renderCart();

}

// ======================
// CHECKOUT
// ======================

const checkoutButton =
    document.querySelector('.checkout-btn');

if (checkoutButton) {

    checkoutButton.addEventListener('click', () => {

        if (cart.length === 0) {

            alert('Seu carrinho está vazio ☕');

            return;

        }

        alert('Pedido realizado com sucesso! ☕✨');

        // limpa carrinho
        localStorage.removeItem('cart');

        cart = [];

        renderCart();

    });

}