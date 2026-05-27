// ======================
// ELEMENTOS
// ======================

const subtotalValue =
    document.getElementById('subtotalValue');

const totalValue =
    document.getElementById('totalValue');

const paymentForm =
    document.getElementById('paymentForm');

const paymentSuccess =
    document.getElementById('paymentSuccess');


// NOVAS SECTIONS
const pixSection =
    document.getElementById('pixSection');

const cardSection =
    document.getElementById('cardSection');

const cashSection =
    document.getElementById('cashSection');


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
// FORMA DE PAGAMENTO
// ======================

const paymentMethod =
    localStorage.getItem('paymentMethod');


// esconde tudo primeiro
pixSection.style.display = 'none';
cardSection.style.display = 'none';
cashSection.style.display = 'none';


// ======================
// PIX
// ======================

if (paymentMethod === 'pix') {

    pixSection.style.display = 'block';

}


// ======================
// CARTÃO
// ======================

if (paymentMethod === 'cartao') {

    cardSection.style.display = 'block';

}


// ======================
// DINHEIRO
// ======================

if (paymentMethod === 'dinheiro') {

    cashSection.style.display = 'block';

}



// ======================
// FINALIZAR PEDIDO
// ======================

paymentForm.addEventListener('submit', (event) => {

    event.preventDefault();

    paymentForm.style.display = 'none';

    paymentSuccess.classList.add('show');

    localStorage.removeItem('cart');

});