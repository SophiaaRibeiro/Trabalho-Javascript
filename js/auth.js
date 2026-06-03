
// ======================
// AUTH - VELVET COFFEE
// ======================

function getUsuarios() {
    return JSON.parse(localStorage.getItem('vc_usuarios')) || [];
}

function getUsuarioLogado() {
    return JSON.parse(localStorage.getItem('vc_logado')) || null;
}

function registrarUsuario(nome, email, senha) {
    const usuarios = getUsuarios();
    const existe = usuarios.find(u => u.email === email);
    if (existe) return { ok: false, msg: 'E-mail já cadastrado.' };
    const novoUsuario = {
        id: 'u_' + Date.now(),
        nome,
        email,
        senha,
        telefone: '',
        endereco: null,
        cartoes: [],
        pedidos: []
    };
    usuarios.push(novoUsuario);
    localStorage.setItem('vc_usuarios', JSON.stringify(usuarios));
    return { ok: true };
}

function loginUsuario(email, senha) {
    const usuarios = getUsuarios();
    const usuario = usuarios.find(u => u.email === email && u.senha === senha);
    if (!usuario) return { ok: false, msg: 'E-mail ou senha incorretos.' };
    localStorage.setItem('vc_logado', JSON.stringify(usuario));
    return { ok: true };
}

function logoutUsuario() {
    localStorage.removeItem('vc_logado');
    window.location.href = determinarRaiz() + 'index.html';
}

function atualizarUsuarioStorage(dadosAtualizados) {
    const usuarios = getUsuarios();
    const idx = usuarios.findIndex(u => u.id === dadosAtualizados.id);
    if (idx !== -1) {
        usuarios[idx] = dadosAtualizados;
        localStorage.setItem('vc_usuarios', JSON.stringify(usuarios));
        localStorage.setItem('vc_logado', JSON.stringify(dadosAtualizados));
    }
}

function recuperarSenha(email) {
    const usuarios = getUsuarios();
    const usuario = usuarios.find(u => u.email === email);
    if (!usuario) return { ok: false, msg: 'E-mail não encontrado.' };
    const novaSenha = 'vc' + Math.floor(1000 + Math.random() * 9000);
    usuario.senha = novaSenha;
    localStorage.setItem('vc_usuarios', JSON.stringify(usuarios));
    return { ok: true, senha: novaSenha };
}

// ======================
// HEADER DINÂMICO
// ======================

function determinarRaiz() {
    const path = window.location.pathname;
    if (path.includes('/pages/')) return '../';
    return '';
}

// function renderizarNavAuth() {
//     const raiz = determinarRaiz();
//     const usuario = getUsuarioLogado();
//     const navActions = document.querySelector('.nav-actions');
//     if (!navActions) return;

//     // Remove qualquer botão de auth antigo para evitar duplicatas
//     navActions.querySelectorAll('.nav-auth-btn').forEach(el => el.remove());

//     if (usuario) {
//         const btnPerfil = document.createElement('a');
//         btnPerfil.className = 'btn-icon nav-auth-btn';
//         btnPerfil.href = raiz + 'pages/perfil.html';
//         btnPerfil.title = 'Meu Perfil';
//         btnPerfil.innerHTML = '<i class="fa-solid fa-user"></i>';

//         const btnLogout = document.createElement('button');
//         btnLogout.className = 'btn-icon nav-auth-btn';
//         btnLogout.title = 'Sair';
//         btnLogout.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i>';
//         btnLogout.addEventListener('click', logoutUsuario);

//         navActions.prepend(btnLogout);
//         navActions.prepend(btnPerfil);
//     } else {
//         const btnLogin = document.createElement('a');
//         btnLogin.className = 'btn-icon nav-auth-btn';
//         btnLogin.href = raiz + 'pages/login.html';
//         btnLogin.title = 'Entrar';
//         btnLogin.innerHTML = '<i class="fa-solid fa-user"></i>';

//         navActions.prepend(btnLogin);
//     }
// }

function renderizarNavAuth() {
    const raiz = determinarRaiz();
    const usuario = getUsuarioLogado();
    const navActions = document.querySelector('.nav-actions');
    if (!navActions) return;

    // Remove qualquer botão de auth antigo para evitar duplicatas
    navActions.querySelectorAll('.nav-auth-btn').forEach(el => el.remove());

    if (usuario) {
        const btnPerfil = document.createElement('a');
        btnPerfil.className = 'btn-icon nav-auth-btn';
        btnPerfil.href = raiz + 'pages/perfil.html';
        btnPerfil.title = 'Meu Perfil';
        btnPerfil.innerHTML = '<i class="fa-solid fa-user"></i>';

        const btnLogout = document.createElement('button');
        btnLogout.className = 'btn-icon nav-auth-btn';
        btnLogout.title = 'Sair';
        btnLogout.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i>';
        btnLogout.addEventListener('click', logoutUsuario);

        navActions.prepend(btnLogout);
        navActions.prepend(btnPerfil);
    } else {
        const btnLogin = document.createElement('a');
        btnLogin.className = 'btn-icon nav-auth-btn';
        btnLogin.href = raiz + 'pages/login.html';
        btnLogin.title = 'Entrar';
        btnLogin.innerHTML = '<i class="fa-solid fa-user"></i>';

        navActions.prepend(btnLogin);
    }
}

function moverAuthParaMenuMobile() {

    const navLinks =
        document.getElementById('nav-links');

    const authButtons =
        document.querySelectorAll('.nav-auth-btn');

    if (
        window.innerWidth <= 950 &&
        navLinks
    ) {

        authButtons.forEach(btn => {

            const li =
                document.createElement('li');

            li.appendChild(btn);

            navLinks.appendChild(li);

        });

    }

}

moverAuthParaMenuMobile();
document.addEventListener('DOMContentLoaded', renderizarNavAuth);
