// Password match validation on register page
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.auth-form');
    const password = document.getElementById('password');
    const confirm = document.getElementById('confirm_password');

    if (form && password && confirm) {
        form.addEventListener('submit', (e) => {
            if (password.value !== confirm.value) {
                e.preventDefault();
                confirm.setCustomValidity('Passwords do not match');
                confirm.reportValidity();
            } else {
                confirm.setCustomValidity('');
            }
        });

        confirm.addEventListener('input', () => confirm.setCustomValidity(''));
    }
});
