const loginForm = document.querySelector("#login");
const createAccountForm = document.querySelector("#createAccount");

const linkCreateAccount = document.querySelector("#linkCreateAccount");
const linkLogin = document.querySelector("#linkLogin");

const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");

const signupUsername = document.getElementById("signupUsername");
const signupEmail = document.getElementById("signupEmail");
const signupPassword = document.getElementById("signupPassword");
const signupCheckPassword = document.getElementById("signupCheckPassword");

function setFormMessage(formElement, type, message) {
    const messageElement = formElement.querySelector(".form-message");
    messageElement.textContent = message;
    messageElement.classList.remove("form-message-success", "form-message-error");
    messageElement.classList.add(`form-message-${type}`);
}

function setInputError(inputElement, message) {
    inputElement.classList.add("form-input-error");
    inputElement.parentElement.querySelector(".form-input-error-message").textContent = message;
}

function clearInputError(inputElement) {
    inputElement.classList.remove("form-input-error");
    inputElement.parentElement.querySelector(".form-input-error-message").textContent = "";
}

document.addEventListener("DOMContentLoaded", () => {

    linkCreateAccount.addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.add("form-hidden");
        createAccountForm.classList.remove("form-hidden");
    });

    linkLogin.addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.remove("form-hidden");
        createAccountForm.classList.add("form-hidden");
    });

    loginForm.addEventListener("submit", e => {
        e.preventDefault();
        var user = window.localStorage.getItem('user');
        var email = window.localStorage.getItem('email');
        var password = window.localStorage.getItem('password');

        if (user && email && password) {

            var formUsername = loginUsername.value.trim();
            var formPassword = loginPassword.value.trim();

            // Check username
            if (user === formUsername || email === formUsername) {
                // Check password
                if (password === formPassword) {
                    window.location.href = './game.html';
                }
            }
        }
        setFormMessage(loginForm, "error", "Invalid username/password combination");
    });

    createAccountForm.addEventListener("submit", e => {
        e.preventDefault();

        window.localStorage.setItem('user', signupUsername.value.trim());
        window.localStorage.setItem('email', signupEmail.value.trim());
        window.localStorage.setItem('password', signupPassword.value.trim());
        window.location.href = './game.html';

    });

    // Prevent errors
    document.querySelectorAll(".form-input").forEach(inputElement => {
        inputElement.addEventListener("blur", e => {
            // Username must have 5 or more characters
            if (e.target.id === "signupUsername" && e.target.value.length > 0 && e.target.value.length < 5) {
                setInputError(inputElement, "El nombre de usuario debe tener al menos 5 caracteres.");
            }
        });

        inputElement.addEventListener("input", e => {
            clearInputError(inputElement);
        });
    });
});