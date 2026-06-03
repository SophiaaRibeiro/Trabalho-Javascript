
// CADASTRO

if (getUsuarioLogado()) {
    window.location.href = '../pages/perfil.html';
}

const toggleSenha = document.getElementById('toggleSenha');
if (toggleSenha) {
    toggleSenha.addEventListener('click', () => {
        const input = document.getElementById('cadSenha');
        const icon = toggleSenha.querySelector('i');
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.replace('fa-eye-slash', 'fa-eye');
        }
    });
}

const cadastroForm = document.getElementById('cadastroForm');

if (cadastroForm) {
    cadastroForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nome = document.getElementById('cadNome').value.trim();
        const email = document.getElementById('cadEmail').value.trim();
        const senha = document.getElementById('cadSenha').value;
        const confirmar = document.getElementById('cadConfirmar').value;

        const nomeError = document.getElementById('nomeError');
        const emailError = document.getElementById('emailError');
        const senhaError = document.getElementById('senhaError');
        const confirmarError = document.getElementById('confirmarError');
        const cadastroError = document.getElementById('cadastroError');

        nomeError.textContent = '';
        emailError.textContent = '';
        senhaError.textContent = '';
        confirmarError.textContent = '';
        cadastroError.textContent = '';

        let valido = true;

        if (!nome || nome.length < 2) {
            nomeError.textContent = 'Informe seu nome completo.';
            valido = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            emailError.textContent = 'Informe um e-mail válido.';
            valido = false;
        }

        if (!senha || senha.length < 6) {
            senhaError.textContent = 'A senha deve ter pelo menos 6 caracteres.';
            valido = false;
        }

        if (senha !== confirmar) {
            confirmarError.textContent = 'As senhas não coincidem.';
            valido = false;
        }

        if (!valido) return;

        const resultado = registrarUsuario(nome, email, senha);

        if (!resultado.ok) {
            cadastroError.textContent = resultado.msg;
            return;
        }

        loginUsuario(email, senha);
        window.location.href = '../pages/perfil.html';
    });
}
