const closeRegisterForm = document.getElementById('closeRegisterForm');
const registerForm = document.getElementById('registerForm');

closeRegisterForm.addEventListener('click', () => {
    registerForm.classList.add('show');
    window.location.href = 'index.html';
});