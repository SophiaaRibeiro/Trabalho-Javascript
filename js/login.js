
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

function limparErro(inputEl, errorEl) {
    inputEl.classList.remove('input--error');
    errorEl.textContent = '';
}

function marcarErro(inputEl, errorEl, msg) {
    inputEl.classList.add('input--error');
    errorEl.textContent = msg;
}

if (loginForm) {
    const emailInput = document.getElementById('loginEmail');
    const senhaInput = document.getElementById('loginSenha');
    const emailError = document.getElementById('emailError');
    const senhaError = document.getElementById('senhaError');
    const loginError = document.getElementById('loginError');

    emailInput.addEventListener('input', () => limparErro(emailInput, emailError));
    senhaInput.addEventListener('input', () => {
        limparErro(senhaInput, senhaError);
        loginError.textContent = '';
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const senha = senhaInput.value;

        limparErro(emailInput, emailError);
        limparErro(senhaInput, senhaError);
        loginError.textContent = '';

        let valido = true;

        if (!email) {
            marcarErro(emailInput, emailError, 'Informe seu e-mail.');
            valido = false;
        }

        if (!senha) {
            marcarErro(senhaInput, senhaError, 'Informe sua senha.');
            valido = false;
        }

        if (!valido) return;

        const resultado = loginUsuario(email, senha);

        if (!resultado.ok) {
            marcarErro(emailInput, emailError, '');
            marcarErro(senhaInput, senhaError, '');
            loginError.textContent = resultado.msg;
            return;
        }

        const redirect = new URLSearchParams(window.location.search).get('redirect');
        window.location.href = redirect || '../pages/perfil.html';
    });
}
