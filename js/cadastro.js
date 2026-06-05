

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

function limparErro(inputEl, errorEl) {
    inputEl.classList.remove('input--error');
    errorEl.textContent = '';
}

function marcarErro(inputEl, errorEl, msg) {
    inputEl.classList.add('input--error');
    errorEl.textContent = msg;
}

const cadastroForm = document.getElementById('cadastroForm');

if (cadastroForm) {
    const nomeInput     = document.getElementById('cadNome');
    const emailInput    = document.getElementById('cadEmail');
    const senhaInput    = document.getElementById('cadSenha');
    const confirmarInput = document.getElementById('cadConfirmar');
    const nomeError     = document.getElementById('nomeError');
    const emailError    = document.getElementById('emailError');
    const senhaError    = document.getElementById('senhaError');
    const confirmarError = document.getElementById('confirmarError');
    const cadastroError = document.getElementById('cadastroError');

    nomeInput.addEventListener('input',      () => limparErro(nomeInput, nomeError));
    emailInput.addEventListener('input',     () => limparErro(emailInput, emailError));
    senhaInput.addEventListener('input',     () => limparErro(senhaInput, senhaError));
    confirmarInput.addEventListener('input', () => limparErro(confirmarInput, confirmarError));

    cadastroForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nome      = nomeInput.value.trim();
        const email     = emailInput.value.trim();
        const senha     = senhaInput.value;
        const confirmar = confirmarInput.value;

        limparErro(nomeInput, nomeError);
        limparErro(emailInput, emailError);
        limparErro(senhaInput, senhaError);
        limparErro(confirmarInput, confirmarError);
        cadastroError.textContent = '';

        let valido = true;

        if (!nome || nome.length < 2) {
            marcarErro(nomeInput, nomeError, 'Informe seu nome completo.');
            valido = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            marcarErro(emailInput, emailError, 'Informe um e-mail válido.');
            valido = false;
        }

        if (!senha || senha.length < 6) {
            marcarErro(senhaInput, senhaError, 'A senha deve ter pelo menos 6 caracteres.');
            valido = false;
        }

        if (senha !== confirmar) {
            marcarErro(confirmarInput, confirmarError, 'As senhas não coincidem.');
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
