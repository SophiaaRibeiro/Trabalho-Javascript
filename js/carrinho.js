
const CUPONS = {
    'VELVET10': { desconto: 10, tipo: 'percentual', label: '10% off' },
    'CAFE20':   { desconto: 20, tipo: 'percentual', label: '20% off' },
    'PROMO15':  { desconto: 15, tipo: 'percentual', label: '15% off' },
    'FRETE':    { desconto: 8,  tipo: 'fixo',       label: 'Frete grátis' }
};

let cupomAtivo = JSON.parse(localStorage.getItem('vc_cupom')) || null;

const summarySubtotal = document.getElementById('summarySubtotal');
const summaryTotal    = document.getElementById('summaryTotal');
const summaryDesconto = document.getElementById('summaryDesconto');
const rowDesconto     = document.getElementById('rowDesconto');
const cupomNome       = document.getElementById('cupomNome');

const cartContainer = document.querySelector('.cart-items');

if (!cartContainer) {
    console.log('Página sem carrinho');
} else {

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function calcularSubtotal() {
        return cart.reduce((acc, p) => {
            return acc + Number(p.price.replace('R$', '').trim()) * p.quantity;
        }, 0);
    }

    function calcularDesconto(subtotal) {
        if (!cupomAtivo) return 0;
        const c = CUPONS[cupomAtivo];
        if (!c) return 0;
        if (c.tipo === 'percentual') return subtotal * (c.desconto / 100);
        return c.desconto;
    }

    function atualizarResumo() {
        const subtotal  = calcularSubtotal();
        const desconto  = calcularDesconto(subtotal);
        const total     = subtotal + 8 - desconto;

        if (summarySubtotal) summarySubtotal.textContent = `R$ ${subtotal.toFixed(2)}`;
        if (summaryTotal)    summaryTotal.textContent    = `R$ ${Math.max(0, total).toFixed(2)}`;

        if (cupomAtivo && desconto > 0) {
            if (rowDesconto)     rowDesconto.style.display = 'flex';
            if (summaryDesconto) summaryDesconto.textContent = `- R$ ${desconto.toFixed(2)}`;
            if (cupomNome)       cupomNome.textContent = cupomAtivo;
        } else {
            if (rowDesconto) rowDesconto.style.display = 'none';
        }
    }

    function renderCart() {

        cartContainer.innerHTML = `
            <div>
                <a href="../pages/cardapio.html" class="btn-back-home">Voltar</a>
            </div>
        `;

        if (cart.length === 0) {
            cartContainer.innerHTML += `
                <div class="empty-state">
                    <div class="empty-icon">🛒</div>
                    <p>Seu carrinho está vazio</p>
                </div>
            `;
            atualizarResumo();
            return;
        }

        cart.forEach((product, index) => {

            const priceNum = Number(product.price.replace('R$', '').trim());
            const item = document.createElement('article');
            item.classList.add('cart-product');
            item.innerHTML = `
                <img src="${product.image}" class="cart-product-img">

                <div class="cart-product-info">
                    <h3 class="cart-product-name">${product.name}</h3>
                    <p class="cart-product-desc">Café especial selecionado.</p>

                    <div class="cart-product-actions">
                        <div class="quantity-control">
                            <button class="decrease" data-index="${index}">-</button>
                            <span>${product.quantity}</span>
                            <button class="increase" data-index="${index}">+</button>
                        </div>
                        <button class="remove-item" data-index="${index}">Remover</button>
                    </div>
                </div>

                <div class="cart-product-price">R$ ${(priceNum * product.quantity).toFixed(2)}</div>
            `;
            cartContainer.appendChild(item);
        });

        atualizarResumo();
        addCartEvents();
    }

    function addCartEvents() {

        document.querySelectorAll('.increase').forEach(btn => {
            btn.addEventListener('click', () => {
                cart[btn.dataset.index].quantity++;
                updateCart();
            });
        });

        document.querySelectorAll('.decrease').forEach(btn => {
            btn.addEventListener('click', () => {
                const i = btn.dataset.index;
                if (cart[i].quantity > 1) cart[i].quantity--;
                else cart.splice(i, 1);
                updateCart();
            });
        });

        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', () => {
                cart.splice(btn.dataset.index, 1);
                updateCart();
            });
        });
    }

    function updateCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    }

    renderCart();
}


const btnAplicarCupom = document.getElementById('btnAplicarCupom');
const cupomInput      = document.getElementById('cupomInput');
const cupomFeedback   = document.getElementById('cupomFeedback');

if (cupomAtivo && cupomInput) {
    cupomInput.value = cupomAtivo;
    mostrarFeedbackCupom(true, `Cupom "${cupomAtivo}" aplicado — ${CUPONS[cupomAtivo].label}!`);
}

if (btnAplicarCupom) {
    btnAplicarCupom.addEventListener('click', () => {
        const codigo = cupomInput.value.trim().toUpperCase();

        if (!codigo) {
            mostrarFeedbackCupom(false, 'Digite um código de cupom.');
            return;
        }

        if (CUPONS[codigo]) {
            cupomAtivo = codigo;
            localStorage.setItem('vc_cupom', JSON.stringify(codigo));
            mostrarFeedbackCupom(true, `Cupom "${codigo}" aplicado — ${CUPONS[codigo].label}!`);
            atualizarResumo();
        } else {
            cupomAtivo = null;
            localStorage.removeItem('vc_cupom');
            mostrarFeedbackCupom(false, 'Cupom inválido ou expirado.');
            atualizarResumo();
        }
    });

    cupomInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') btnAplicarCupom.click();
    });
}

function mostrarFeedbackCupom(sucesso, msg) {
    if (!cupomFeedback) return;
    cupomFeedback.textContent = msg;
    cupomFeedback.className = 'coupon-feedback ' + (sucesso ? 'coupon-ok' : 'coupon-err');
}


const checkoutBtn = document.getElementById('checkoutBtn');

if (checkoutBtn) {
    checkoutBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        if (cart.length === 0) {
            alert('Seu carrinho está vazio ☕');
            return;
        }

        const metodoPagamento = document.getElementById('paymentMethod')?.value || 'pix';
        localStorage.setItem('paymentMethod', metodoPagamento);

        window.location.href = '../pages/pagamento.html';
    });
}
