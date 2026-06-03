
// ESQUECI A SENHA

const esqueciForm = document.getElementById('esqueciForm');

if (esqueciForm) {
    const esqueciEmailInput = document.getElementById('esqueciEmail');
    const emailError        = document.getElementById('emailError');
    const esqueciError      = document.getElementById('esqueciError');

    esqueciEmailInput.addEventListener('input', () => {
        esqueciEmailInput.classList.remove('input--error');
        emailError.textContent = '';
        esqueciError.textContent = '';
    });

    esqueciForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = esqueciEmailInput.value.trim();

        esqueciEmailInput.classList.remove('input--error');
        emailError.textContent = '';
        esqueciError.textContent = '';

        if (!email) {
            esqueciEmailInput.classList.add('input--error');
            emailError.textContent = 'Informe seu e-mail.';
            return;
        }

        const resultado = recuperarSenha(email);

        if (!resultado.ok) {
            esqueciEmailInput.classList.add('input--error');
            esqueciError.textContent = resultado.msg;
            return;
        }

        document.getElementById('formSection').style.display = 'none';
        document.getElementById('resultSection').style.display = 'block';
        document.getElementById('senhaTemp').textContent = resultado.senha;
    });
}
