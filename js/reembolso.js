
// ======================
// REEMBOLSO
// ======================

const usuario = getUsuarioLogado();
const reembolsoWrap = document.getElementById('reembolsoWrap');
const reembolsoLogin = document.getElementById('reembolsoLogin');
const reembolsoSucesso = document.getElementById('reembolsoSucesso');
const pedidoSelect = document.getElementById('pedidoSelect');
const pedidoDetalhe = document.getElementById('pedidoDetalhe');

if (!usuario) {
    if (reembolsoWrap) reembolsoWrap.style.display = 'none';
    if (reembolsoLogin) reembolsoLogin.style.display = 'block';
} else {
    carregarPedidos();
}

function carregarPedidos() {
    const pedidos = usuario.pedidos || [];

    // Filtra apenas pedidos SEM reembolso já solicitado
    const pedidosDisponiveis = pedidos.filter(p => !p.reembolsoSolicitado);

    if (pedidos.length === 0) {
        reembolsoWrap.innerHTML = `
            <div class="perfil-card" style="text-align:center;">
                <div class="auth-logo-icon" style="margin:0 auto 1.5rem;">
                    <i class="fa-solid fa-bag-shopping"></i>
                </div>
                <h2 style="font-family:'Playfair Display',serif; margin-bottom:0.5rem;">Sem pedidos</h2>
                <p style="color:var(--text-light); margin-bottom:1.5rem;">Você ainda não realizou nenhum pedido.</p>
                <a href="../pages/cardapio.html" class="btn-auth" style="text-decoration:none; display:inline-flex;">
                    <span>Ver Cardápio</span>
                    <i class="fa-solid fa-arrow-right"></i>
                </a>
            </div>
        `;
        return;
    }

    if (pedidosDisponiveis.length === 0) {
        reembolsoWrap.innerHTML = `
            <div class="perfil-card" style="text-align:center;">
                <div class="auth-logo-icon auth-logo-icon--success" style="margin:0 auto 1.5rem;">
                    <i class="fa-solid fa-circle-check"></i>
                </div>
                <h2 style="font-family:'Playfair Display',serif; margin-bottom:0.5rem;">Sem pedidos disponíveis</h2>
                <p style="color:var(--text-light); margin-bottom:1.5rem;">Todos os seus pedidos já possuem reembolso solicitado.</p>
                <a href="../pages/perfil.html?tab=historico" class="btn-auth" style="text-decoration:none; display:inline-flex;">
                    <span>Ver Histórico</span>
                    <i class="fa-solid fa-clock-rotate-left"></i>
                </a>
            </div>
        `;
        return;
    }

    pedidosDisponiveis.forEach(p => {
        const option = document.createElement('option');
        option.value = p.codigo;
        option.textContent = `${p.codigo} — ${p.data} — R$ ${p.total.toFixed(2)}`;
        pedidoSelect.appendChild(option);
    });

    const codigoParam = new URLSearchParams(window.location.search).get('pedido');
    if (codigoParam) {
        pedidoSelect.value = codigoParam;
        mostrarDetalhePedido(codigoParam);
    }
}

if (pedidoSelect) {
    pedidoSelect.addEventListener('change', () => {
        mostrarDetalhePedido(pedidoSelect.value);
    });
}

function mostrarDetalhePedido(codigo) {
    if (!codigo || !pedidoDetalhe) return;
    const pedido = (usuario.pedidos || []).find(p => p.codigo === codigo);

    if (!pedido) {
        pedidoDetalhe.style.display = 'none';
        return;
    }

    pedidoDetalhe.style.display = 'block';
    pedidoDetalhe.innerHTML = `
        <div class="pedido-detalhe-inner">
            <div class="pedido-detalhe-header">
                <span class="pedido-codigo">${pedido.codigo}</span>
                <span class="pedido-data">${pedido.data}</span>
            </div>
            <div class="pedido-itens">
                ${pedido.itens.map(item => `
                    <div class="pedido-item-linha">
                        <span>${item.name}</span>
                        <span class="pedido-item-qtd">x${item.quantity}</span>
                        <span class="pedido-item-preco">${item.price}</span>
                    </div>
                `).join('')}
            </div>
            <div class="pedido-item-footer" style="margin-top:0.75rem;">
                <span>Total: <strong>R$ ${pedido.total.toFixed(2)}</strong></span>
            </div>
        </div>
    `;
}

const reembolsoForm = document.getElementById('reembolsoForm');

if (reembolsoForm) {
    reembolsoForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const pedidoCodigo = pedidoSelect ? pedidoSelect.value : '';
        const motivo = document.getElementById('motivoSelect').value;
        const descricao = document.getElementById('descricaoProblema').value.trim();
        const reembolsoError = document.getElementById('reembolsoError');

        reembolsoError.textContent = '';

        if (!pedidoCodigo) {
            reembolsoError.textContent = 'Selecione um pedido.';
            return;
        }

        if (!motivo) {
            reembolsoError.textContent = 'Selecione o motivo do reembolso.';
            return;
        }

        if (!descricao || descricao.length < 10) {
            reembolsoError.textContent = 'Descreva o problema com pelo menos 10 caracteres.';
            return;
        }

        const protocolo = 'REE-' + Date.now().toString().slice(-8);

        const solicitacao = {
            protocolo,
            pedidoCodigo,
            motivo,
            descricao,
            data: new Date().toLocaleDateString('pt-BR')
        };

        const reembolsos = JSON.parse(localStorage.getItem('vc_reembolsos')) || [];
        reembolsos.push(solicitacao);
        localStorage.setItem('vc_reembolsos', JSON.stringify(reembolsos));

        // Marcar o pedido como reembolsado no histórico do usuário
        const idxPedido = (usuario.pedidos || []).findIndex(p => p.codigo === pedidoCodigo);
        if (idxPedido !== -1) {
            usuario.pedidos[idxPedido].reembolsoSolicitado = true;
            usuario.pedidos[idxPedido].reembolsoProtocolo = protocolo;
            usuario.pedidos[idxPedido].status = 'Reembolso Solicitado';
            atualizarUsuarioStorage(usuario);
        }

        reembolsoWrap.style.display = 'none';
        reembolsoSucesso.style.display = 'block';
        document.getElementById('protocoloNumero').textContent = protocolo;
    });
}
