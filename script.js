const toggle = document.querySelector('.menu-toggle');
const links = document.querySelector('.links');

if (toggle && links) {
    toggle.addEventListener('click', () => {
        const open = links.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(open));
    });
}

document.querySelectorAll('form[data-local-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        if (!form.reportValidity()) {
            return;
        }

        const data = new FormData(form);
        const type = form.dataset.localForm;
        const email = String(data.get('email') || '').trim().toLowerCase();

        if (type === 'register') {
            const users = JSON.parse(localStorage.getItem('labUsers') || '{}');

            if (users[email]) {
                showMessage(form, 'An account with this email already exists. Please sign in.');
                return;
            }

            users[email] = {
                name: String(data.get('name')).trim(),
                password: String(data.get('password'))
            };

            localStorage.setItem('labUsers', JSON.stringify(users));
            showMessage(form, 'Your account is ready. You can now sign in.');
            form.reset();
        } else if (type === 'login') {
            const users = JSON.parse(localStorage.getItem('labUsers') || '{}');

            if (!users[email] || users[email].password !== String(data.get('password'))) {
                showMessage(
                    form,
                    'Email or password did not match. Create an account if you are new.',
                    true
                );
                return;
            }

            localStorage.setItem('labCurrentUser', users[email].name);
            location.href = 'home.html';
        } else {
            showMessage(form, 'Thank you. Your message has been recorded on this device.');
            form.reset();
        }
    });
});

function showMessage(form, text, error = false) {
    const box = form.querySelector('.notice');

    if (box) {
        box.textContent = text;
        box.style.display = 'block';
        box.style.background = error ? '#fff0ed' : '#e4f6ee';
        box.style.color = error ? '#9a392b' : '#176c52';
    }
}
