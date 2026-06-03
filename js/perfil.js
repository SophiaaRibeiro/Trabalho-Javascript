
// ======================
// PERFIL
// ======================

const usuario = getUsuarioLogado();

if (!usuario) {
    window.location.href = '../pages/login.html?redirect=../pages/perfil.html';
}

// ABAS

const tabs = document.querySelectorAll('.perfil-tab');
const panels = document.querySelectorAll('.perfil-panel');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('panel' + capitalize(tab.dataset.tab)).classList.add('active');
    });
});

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// SAUDAÇÃO

const saudacao = document.getElementById('perfilSaudacao');
if (saudacao && usuario) {
    saudacao.textContent = `Olá, ${usuario.nome}! Gerencie seus dados aqui.`;
}

// ======================
// DADOS PESSOAIS
// ======================

function carregarDados() {
    if (!usuario) return;
    document.getElementById('pNome').value = usuario.nome || '';
    document.getElementById('pEmail').value = usuario.email || '';
    document.getElementById('pTelefone').value = usuario.telefone || '';

    if (usuario.endereco) {
        const e = usuario.endereco;
        document.getElementById('pCep').value = e.cep || '';
        document.getElementById('pEstado').value = e.estado || '';
        document.getElementById('pCidade').value = e.cidade || '';
        document.getElementById('pBairro').value = e.bairro || '';
        document.getElementById('pRua').value = e.rua || '';
        document.getElementById('pNumero').value = e.numero || '';
        document.getElementById('pComplemento').value = e.complemento || '';
    }
}

carregarDados();

const formDados = document.getElementById('formDados');
if (formDados) {
    formDados.addEventListener('submit', (e) => {
        e.preventDefault();

        usuario.nome = document.getElementById('pNome').value.trim();
        usuario.telefone = document.getElementById('pTelefone').value.trim();
        usuario.endereco = {
            cep: document.getElementById('pCep').value.trim(),
            estado: document.getElementById('pEstado').value.trim(),
            cidade: document.getElementById('pCidade').value.trim(),
            bairro: document.getElementById('pBairro').value.trim(),
            rua: document.getElementById('pRua').value.trim(),
            numero: document.getElementById('pNumero').value.trim(),
            complemento: document.getElementById('pComplemento').value.trim()
        };

        atualizarUsuarioStorage(usuario);
        showToast('Dados salvos com sucesso! ✅');
    });
}

// ======================
// TROCA DE SENHA
// ======================

const formSenha = document.getElementById('formSenha');
if (formSenha) {
    document.querySelectorAll('.btn-toggle-pass').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.target;
            if (!targetId) return;
            const input = document.getElementById(targetId);
            if (!input) return;
            
            const icon = btn.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.replace('fa-eye-slash', 'fa-eye');
            }
        });
    });

    const senhaAtualInput    = document.getElementById('senhaAtual');
    const senhaNovaInput     = document.getElementById('senhaNova');
    const senhaConfirmarInput = document.getElementById('senhaConfirmar');
    const errorAtual         = document.getElementById('senhaAtualError');
    const errorNova          = document.getElementById('senhaNovaError');
    const errorConfirmar     = document.getElementById('senhaConfirmarError');
    const errorForm          = document.getElementById('senhaFormError');

    function limparErroCampo(input, error) {
        input.classList.remove('input--error');
        error.textContent = '';
        if (errorForm) errorForm.textContent = '';
    }

    senhaAtualInput.addEventListener('input',     () => limparErroCampo(senhaAtualInput, errorAtual));
    senhaNovaInput.addEventListener('input',      () => limparErroCampo(senhaNovaInput, errorNova));
    senhaConfirmarInput.addEventListener('input', () => limparErroCampo(senhaConfirmarInput, errorConfirmar));

    formSenha.addEventListener('submit', (e) => {
        e.preventDefault();

        const senhaAtual    = senhaAtualInput.value;
        const senhaNova     = senhaNovaInput.value;
        const senhaConfirmar = senhaConfirmarInput.value;

        senhaAtualInput.classList.remove('input--error');
        senhaNovaInput.classList.remove('input--error');
        senhaConfirmarInput.classList.remove('input--error');
        errorAtual.textContent = '';
        errorNova.textContent = '';
        errorConfirmar.textContent = '';
        errorForm.textContent = '';

        let valido = true;

        if (!senhaAtual) {
            senhaAtualInput.classList.add('input--error');
            errorAtual.textContent = 'Informe a senha atual.';
            valido = false;
        } else if (senhaAtual !== usuario.senha) {
            senhaAtualInput.classList.add('input--error');
            errorAtual.textContent = 'Senha atual incorreta.';
            valido = false;
        }

        if (!senhaNova || senhaNova.length < 6) {
            senhaNovaInput.classList.add('input--error');
            errorNova.textContent = 'A nova senha deve ter pelo menos 6 caracteres.';
            valido = false;
        }

        if (senhaNova !== senhaConfirmar) {
            senhaConfirmarInput.classList.add('input--error');
            errorConfirmar.textContent = 'As novas senhas não coincidem.';
            valido = false;
        }

        if (!valido) return;

        usuario.senha = senhaNova;
        atualizarUsuarioStorage(usuario);

        showToast('Senha alterada com sucesso! 🔐');
        formSenha.reset();
    });
}


// ======================
// CARTÕES
// ======================

function renderCartoes() {
    const lista = document.getElementById('listaCartoes');
    if (!lista) return;

    const cartoes = usuario.cartoes || [];

    if (cartoes.length === 0) {
        lista.innerHTML = `
            <div class="empty-cartoes">
                <i class="fa-solid fa-credit-card"></i>
                <p>Nenhum cartão salvo ainda.</p>
            </div>
        `;
        return;
    }

    lista.innerHTML = cartoes.map((c, i) => `
        <div class="cartao-salvo">
            <div class="cartao-salvo-icon">
                <i class="fa-solid fa-credit-card"></i>
            </div>
            <div class="cartao-salvo-info">
                <span class="cartao-salvo-num">•••• •••• •••• ${c.numero.slice(-4)}</span>
                <span class="cartao-salvo-nome">${c.nome}</span>
            </div>
            <span class="cartao-salvo-val">${c.validade}</span>
            <button class="btn-remover-cartao" data-index="${i}" title="Remover">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `).join('');

    document.querySelectorAll('.btn-remover-cartao').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.dataset.index);
            usuario.cartoes.splice(idx, 1);
            atualizarUsuarioStorage(usuario);
            renderCartoes();
            showToast('Cartão removido.');
        });
    });
}

renderCartoes();

// PREVIEW AO VIVO

const cartaoNome = document.getElementById('cartaoNome');
const cartaoNumero = document.getElementById('cartaoNumero');
const cartaoValidade = document.getElementById('cartaoValidade');

if (cartaoNome) {
    cartaoNome.addEventListener('input', () => {
        document.getElementById('prevNome').textContent =
            cartaoNome.value.toUpperCase() || 'SEU NOME';
    });
}

if (cartaoNumero) {
    cartaoNumero.addEventListener('input', () => {
        let v = cartaoNumero.value.replace(/\D/g, '').slice(0, 16);
        cartaoNumero.value = v.replace(/(.{4})/g, '$1 ').trim();
        const display = v.padEnd(16, '•').replace(/(.{4})/g, '$1 ').trim();
        document.getElementById('prevNumero').textContent = display;
    });
}

if (cartaoValidade) {
    cartaoValidade.addEventListener('input', () => {
        let v = cartaoValidade.value.replace(/\D/g, '').slice(0, 4);
        if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
        cartaoValidade.value = v;
        document.getElementById('prevValidade').textContent = v || 'MM/AA';
    });
}

const formCartao = document.getElementById('formCartao');
if (formCartao) {
    formCartao.addEventListener('submit', (e) => {
        e.preventDefault();

        const nome = cartaoNome.value.trim();
        const numero = cartaoNumero.value.replace(/\s/g, '');
        const validade = cartaoValidade.value.trim();
        const cvv = document.getElementById('cartaoCvv').value.trim();
        const cartaoError = document.getElementById('cartaoError');

        cartaoError.textContent = '';

        if (!nome || !numero || !validade || !cvv) {
            cartaoError.textContent = 'Preencha todos os campos do cartão.';
            return;
        }

        if (numero.length < 16) {
            cartaoError.textContent = 'Número de cartão inválido.';
            return;
        }

        if (!usuario.cartoes) usuario.cartoes = [];

        usuario.cartoes.push({ nome, numero, validade, cvv });
        atualizarUsuarioStorage(usuario);
        renderCartoes();
        formCartao.reset();
        document.getElementById('prevNome').textContent = 'SEU NOME';
        document.getElementById('prevNumero').textContent = '•••• •••• •••• ••••';
        document.getElementById('prevValidade').textContent = 'MM/AA';
        showToast('Cartão salvo com sucesso! 💳');
    });
}

// ======================
// HISTÓRICO DE PEDIDOS
// ======================

function renderHistorico() {
    const lista = document.getElementById('listaHistorico');
    if (!lista) return;

    const pedidos = usuario.pedidos || [];

    if (pedidos.length === 0) {
        lista.innerHTML = `
            <div class="empty-cartoes">
                <i class="fa-solid fa-bag-shopping"></i>
                <p>Nenhum pedido realizado ainda.</p>
            </div>
        `;
        return;
    }

    lista.innerHTML = pedidos.slice().reverse().map(p => {

        const acaoReembolso = p.reembolsoSolicitado
            ? `<span class="badge-reembolso">
                   <i class="fa-solid fa-rotate-left"></i>
                   Reembolso Solicitado
               </span>`
            : `<a href="../pages/reembolso.html?pedido=${p.codigo}" class="btn-reembolso">
                   <i class="fa-solid fa-rotate-left"></i> Solicitar Reembolso
               </a>`;

        return `
        <div class="pedido-item">
            <div class="pedido-item-header">
                <div>
                    <span class="pedido-codigo">${p.codigo}</span>
                    <span class="pedido-data">${p.data}</span>
                </div>
                <span class="pedido-status pedido-status--${p.status === 'Entregue' ? 'ok' : p.reembolsoSolicitado ? 'reembolso' : 'pendente'}">
                    ${p.status}
                </span>
            </div>
            <div class="pedido-itens">
                ${p.itens.map(item => `
                    <div class="pedido-item-linha">
                        <span>${item.name}</span>
                        <span class="pedido-item-qtd">x${item.quantity}</span>
                        <span class="pedido-item-preco">${item.price}</span>
                    </div>
                `).join('')}
            </div>
            <div class="pedido-item-footer">
                <span>Total: <strong>R$ ${p.total.toFixed(2)}</strong></span>
                ${acaoReembolso}
            </div>
            ${p.reembolsoSolicitado && p.reembolsoProtocolo ? `
                <div class="protocolo-info">
                    <i class="fa-solid fa-file-lines"></i>
                    Protocolo: <strong>${p.reembolsoProtocolo}</strong>
                </div>
            ` : ''}
        </div>
    `;
    }).join('');
}

renderHistorico();

// TOAST

function showToast(msg) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.classList.add('toast');
    toast.textContent = msg;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ABRIR ABA DE HISTÓRICO se vier por query param

const urlTab = new URLSearchParams(window.location.search).get('tab');
if (urlTab) {
    const targetTab = document.querySelector(`[data-tab="${urlTab}"]`);
    if (targetTab) targetTab.click();
}
