const CUPONS = {
    'VELVET10': { desconto: 10, tipo: 'percentual', label: '10% off' },
    'CAFE20':   { desconto: 20, tipo: 'percentual', label: '20% off' },
    'PROMO15':  { desconto: 15, tipo: 'percentual', label: '15% off' },
    'FRETE':    { desconto: 8,  tipo: 'fixo',       label: 'Frete grátis' }
};


const cart = JSON.parse(localStorage.getItem('cart')) || [];
const cupomAtivo = JSON.parse(localStorage.getItem('vc_cupom')) || null;

let subtotal = cart.reduce((acc, p) => {
    return acc + Number(p.price.replace('R$', '').trim()) * p.quantity;
}, 0);

function calcularDesconto(sub) {
    if (!cupomAtivo || !CUPONS[cupomAtivo]) return 0;
    const c = CUPONS[cupomAtivo];
    return c.tipo === 'percentual' ? sub * (c.desconto / 100) : c.desconto;
}

const desconto = calcularDesconto(subtotal);
const total = Math.max(0, subtotal + 8 - desconto);


const subtotalValue    = document.getElementById('subtotalValue');
const totalValue       = document.getElementById('totalValue');
const payRowDesconto   = document.getElementById('payRowDesconto');
const payCupomNome     = document.getElementById('payCupomNome');
const payDescontoValue = document.getElementById('payDescontoValue');

if (subtotalValue) subtotalValue.textContent = `R$ ${subtotal.toFixed(2)}`;
if (totalValue)    totalValue.textContent    = `R$ ${total.toFixed(2)}`;

if (cupomAtivo && desconto > 0) {
    if (payRowDesconto)   payRowDesconto.style.display = 'flex';
    if (payCupomNome)     payCupomNome.textContent     = cupomAtivo;
    if (payDescontoValue) payDescontoValue.textContent = `- R$ ${desconto.toFixed(2)}`;
}


const paymentMethodRaw = localStorage.getItem('paymentMethod') || 'cartao';
const pixSection  = document.getElementById('pixSection');
const cardSection = document.getElementById('cardSection');
const cashSection = document.getElementById('cashSection');

if (pixSection)  pixSection.style.display  = 'none';
if (cardSection) cardSection.style.display = 'none';
if (cashSection) cashSection.style.display = 'none';

if (paymentMethodRaw === 'pix')      { if (pixSection)  pixSection.style.display  = 'block'; }
if (paymentMethodRaw === 'dinheiro') { if (cashSection) cashSection.style.display = 'block'; }
if (paymentMethodRaw === 'cartao')   { if (cardSection) cardSection.style.display = 'block'; }


const usuario = getUsuarioLogado ? getUsuarioLogado() : null;
const enderecoSalvoArea  = document.getElementById('enderecoSalvoArea');
const enderecoInputArea  = document.getElementById('enderecoInputArea');
const enderecoSalvoInfo  = document.getElementById('enderecoSalvoInfo');
const btnTrocarEndereco  = document.getElementById('btnTrocarEndereco');

let usandoEnderecoSalvo = false;

if (usuario && usuario.endereco && usuario.endereco.rua) {
    const e = usuario.endereco;
    const endStr = `${e.rua}, ${e.numero}${e.complemento ? ' – ' + e.complemento : ''}, ${e.bairro}, ${e.cidade} – ${e.estado}`;
    if (enderecoSalvoInfo) enderecoSalvoInfo.innerHTML = `
        <i class="fa-solid fa-location-dot"></i>
        <span>${endStr}</span>
    `;
    if (enderecoSalvoArea) enderecoSalvoArea.style.display = 'block';
    if (enderecoInputArea) enderecoInputArea.style.display = 'none';
    usandoEnderecoSalvo = true;
}

if (btnTrocarEndereco) {
    btnTrocarEndereco.addEventListener('click', () => {
        enderecoSalvoArea.style.display = 'none';
        enderecoInputArea.style.display = 'block';
        usandoEnderecoSalvo = false;
    });
}


const cartoesArea   = document.getElementById('cartoesArea');
const cartoesList   = document.getElementById('cartoesList');
const novoCartaoArea = document.getElementById('novoCartaoArea');
const btnNovoCartao  = document.getElementById('btnNovoCartao');
const btnVerSalvos   = document.getElementById('btnVerSalvos');
const salvarCartaoWrap = document.getElementById('salvarCartaoWrap');

let cartaoSelecionadoIdx = -1;
let usandoCartaoSalvo = false;

if (paymentMethodRaw === 'cartao') {

    const cartoes = usuario?.cartoes || [];

    if (cartoes.length > 0) {
        if (cartoesArea) cartoesArea.style.display = 'block';
        if (novoCartaoArea) novoCartaoArea.style.display = 'none';
        usandoCartaoSalvo = true;
        cartaoSelecionadoIdx = 0;
        renderCartoesSalvos(cartoes);
    }

    if (usuario && salvarCartaoWrap) {
        salvarCartaoWrap.style.display = 'block';
    }

    if (btnNovoCartao) {
        btnNovoCartao.addEventListener('click', () => {
            cartoesArea.style.display = 'none';
            novoCartaoArea.style.display = 'block';
            if (btnVerSalvos) btnVerSalvos.style.display = 'flex';
            usandoCartaoSalvo = false;
            cartaoSelecionadoIdx = -1;
        });
    }

    if (btnVerSalvos) {
        btnVerSalvos.addEventListener('click', () => {
            novoCartaoArea.style.display = 'none';
            cartoesArea.style.display = 'block';
            btnVerSalvos.style.display = 'none';
            usandoCartaoSalvo = true;
            cartaoSelecionadoIdx = 0;
        });
    }

    const cardNumeroInput = document.getElementById('cardNumero');
    if (cardNumeroInput) {
        cardNumeroInput.addEventListener('input', () => {
            let v = cardNumeroInput.value.replace(/\D/g, '').slice(0, 16);
            cardNumeroInput.value = v.replace(/(.{4})/g, '$1 ').trim();
        });
    }

    const cardValidadeInput = document.getElementById('cardValidade');
    if (cardValidadeInput) {
        cardValidadeInput.addEventListener('input', () => {
            let v = cardValidadeInput.value.replace(/\D/g, '').slice(0, 4);
            if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
            cardValidadeInput.value = v;
        });
    }
}

function renderCartoesSalvos(cartoes) {
    if (!cartoesList) return;
    cartoesList.innerHTML = cartoes.map((c, i) => `
        <div class="cartao-checkout-item ${i === 0 ? 'selected' : ''}" data-idx="${i}">
            <div class="cartao-checkout-icon">
                <i class="fa-solid fa-credit-card"></i>
            </div>
            <div class="cartao-checkout-info">
                <span class="cartao-checkout-num">•••• ${c.numero.slice(-4)}</span>
                <span class="cartao-checkout-nome">${c.nome}</span>
            </div>
            <div class="cartao-checkout-check ${i === 0 ? 'active' : ''}">
                <i class="fa-solid fa-circle-check"></i>
            </div>
        </div>
    `).join('');

    cartoesList.querySelectorAll('.cartao-checkout-item').forEach(item => {
        item.addEventListener('click', () => {
            cartoesList.querySelectorAll('.cartao-checkout-item').forEach(el => {
                el.classList.remove('selected');
                el.querySelector('.cartao-checkout-check').classList.remove('active');
            });
            item.classList.add('selected');
            item.querySelector('.cartao-checkout-check').classList.add('active');
            cartaoSelecionadoIdx = parseInt(item.dataset.idx);
        });
    });
}

function gerarCodigoPedido() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codigo = 'VC-';
    for (let i = 0; i < 6; i++) {
        codigo += chars[Math.floor(Math.random() * chars.length)];
    }
    return codigo;
}

function formatarData() {
    const agora = new Date();
    return agora.toLocaleDateString('pt-BR') + ' ' + agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}


const paymentForm    = document.getElementById('paymentForm');
const paymentSuccess = document.getElementById('paymentSuccess');
const paymentError   = document.getElementById('paymentError');

if (paymentForm) {
    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (paymentError) paymentError.textContent = '';

        let enderecoFinal = '';
        if (usandoEnderecoSalvo && usuario?.endereco) {
            const en = usuario.endereco;
            enderecoFinal = `${en.rua}, ${en.numero}, ${en.bairro}, ${en.cidade}`;
        } else {
            const inp = document.getElementById('enderecoInput');
            enderecoFinal = inp?.value.trim() || '';
        }

        if (!enderecoFinal) {
            if (paymentError) paymentError.textContent = 'Por favor, informe o endereço de entrega.';
            document.getElementById('addressSection')?.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        if (paymentMethodRaw === 'cartao' && !usandoCartaoSalvo) {
            const nome    = document.getElementById('cardNome')?.value.trim();
            const numero  = document.getElementById('cardNumero')?.value.replace(/\s/g, '');
            const validade = document.getElementById('cardValidade')?.value.trim();
            const cvv     = document.getElementById('cardCvv')?.value.trim();

            if (!nome || !numero || !validade || !cvv) {
                if (paymentError) paymentError.textContent = 'Preencha todos os dados do cartão.';
                return;
            }

            if (numero.length < 16) {
                if (paymentError) paymentError.textContent = 'Número de cartão inválido.';
                return;
            }

            const salvar = document.getElementById('checkSalvarCartao')?.checked;
            if (salvar && usuario) {
                if (!usuario.cartoes) usuario.cartoes = [];
                usuario.cartoes.push({ nome, numero, validade, cvv });
                atualizarUsuarioStorage(usuario);
            }
        }

        const codigoPedido = gerarCodigoPedido();
        const dataAtual    = formatarData();

        if (usuario) {
            if (!usuario.pedidos) usuario.pedidos = [];
            usuario.pedidos.push({
                codigo: codigoPedido,
                data: dataAtual,
                itens: cart,
                total: total,
                desconto: desconto,
                cupom: cupomAtivo,
                status: 'Entregue',
                endereco: enderecoFinal,
                pagamento: paymentMethodRaw
            });
            atualizarUsuarioStorage(usuario);
        }

        const codigoDisplay = document.getElementById('codigoPedidoDisplay');
        if (codigoDisplay) codigoDisplay.textContent = codigoPedido;

        paymentForm.style.display = 'none';
        if (paymentSuccess) paymentSuccess.classList.add('show');

        localStorage.removeItem('cart');
        localStorage.removeItem('paymentMethod');
        localStorage.removeItem('vc_cupom');
    });
}