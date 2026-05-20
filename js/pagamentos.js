// pagamento.js

const subtotalValue =
    document.getElementById('subtotalValue');

const totalValue =
    document.getElementById('totalValue');

const paymentForm =
    document.getElementById('paymentForm');

const paymentSuccess =
    document.getElementById('paymentSuccess');


// ======================
// PEGAR CARRINHO
// ======================

const cart =
    JSON.parse(localStorage.getItem('cart')) || [];

let subtotal = 0;

cart.forEach(product => {

    const price =
        Number(
            product.price
                .replace('R$', '')
                .trim()
        );

    subtotal +=
        price * product.quantity;

});

const total = subtotal + 8;


// ======================
// MOSTRAR VALORES
// ======================

subtotalValue.textContent =
    `R$ ${subtotal}`;

totalValue.textContent =
    `R$ ${total}`;



// ======================
// FINALIZAR
// ======================

paymentForm.addEventListener('submit', (event) => {

    event.preventDefault();

    paymentForm.style.display = 'none';

    paymentSuccess.classList.add('show');

    localStorage.removeItem('cart');

});