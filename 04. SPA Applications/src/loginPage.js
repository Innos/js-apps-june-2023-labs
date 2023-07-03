import { showCatalog } from "./catalogPage.js";

let _domElement = undefined;
export async function showLogin(domElement) {
    _domElement = domElement;
    domElement.innerHTML = '';
    domElement.innerHTML = `<article id="login">
    <h2>Login</h2>
    <form>
        <label>E-mail: <input type="text" name="email"></label>
        <label>Password: <input type="password" name="password"></label>
        <input type="submit" value="Login">
    </form>
</article>`;

    let form = domElement.querySelector('form');
    form.addEventListener('submit', login);
}

async function login(e) {
    e.preventDefault();
    let form = e.target;
    let formData = new FormData(form);

    let url = 'http://localhost:3030/users/login';
    let settings = {
        method: 'Post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: formData.get('email'),
            password: formData.get('password')
        })
    };

    let response = await fetch(url, settings);
    let result = await response.json();

    sessionStorage.setItem('accessToken', result.accessToken);
    showCatalog(_domElement);
}
