const loginForm = document.querySelector('.login-form');
const errorMessageElement = document.querySelector('.error-message');

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const username = document.querySelector('input[name="username"]').value;
    const password = document.querySelector('input[name="password"]').value;

    if (username === 'admin' && password === 'admin') {
        window.location.href = 'http://127.0.0.1:5501/quanlysinhvien.html'; 
    } else {
        errorMessageElement.textContent = 'Tài khoản hoặc mật khẩu không chính xác';
    }
});
