
// ESQUECI A SENHA

const esqueciForm = document.getElementById('esqueciForm');

if (esqueciForm) {
    esqueciForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('esqueciEmail').value.trim();
        const emailError = document.getElementById('emailError');
        const esqueciError = document.getElementById('esqueciError');

        emailError.textContent = '';
        esqueciError.textContent = '';

        if (!email) {
            emailError.textContent = 'Informe seu e-mail.';
            return;
        }

        const resultado = recuperarSenha(email);

        if (!resultado.ok) {
            esqueciError.textContent = resultado.msg;
            return;
        }

        document.getElementById('formSection').style.display = 'none';
        document.getElementById('resultSection').style.display = 'block';
        document.getElementById('senhaTemp').textContent = resultado.senha;
    });
}
