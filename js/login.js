
// LOGIN

const loginForm = document.getElementById('loginForm');

if (getUsuarioLogado()) {
    window.location.href = '../pages/perfil.html';
}

const toggleSenha = document.getElementById('toggleSenha');
if (toggleSenha) {
    toggleSenha.addEventListener('click', () => {
        const input = document.getElementById('loginSenha');
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

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value.trim();
        const senha = document.getElementById('loginSenha').value;
        const emailError = document.getElementById('emailError');
        const senhaError = document.getElementById('senhaError');
        const loginError = document.getElementById('loginError');

        emailError.textContent = '';
        senhaError.textContent = '';
        loginError.textContent = '';

        let valido = true;

        if (!email) {
            emailError.textContent = 'Informe seu e-mail.';
            valido = false;
        }

        if (!senha) {
            senhaError.textContent = 'Informe sua senha.';
            valido = false;
        }

        if (!valido) return;

        const resultado = loginUsuario(email, senha);

        if (!resultado.ok) {
            loginError.textContent = resultado.msg;
            return;
        }

        const redirect = new URLSearchParams(window.location.search).get('redirect');
        window.location.href = redirect || '../pages/perfil.html';
    });
}
