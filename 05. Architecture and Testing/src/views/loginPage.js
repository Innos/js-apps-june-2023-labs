import { showCatalog } from "./catalogPage.js";
import * as userService from '../services/usersService.js';

let _domElement = undefined;
let _navigate = undefined;
export async function showLogin(domElement, navigate) {
    _domElement = domElement;
    _navigate = navigate;
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

    let user = {
        email: formData.get('email'),
        password: formData.get('password')
    };

    let result = await userService.login(user);
    _navigate('catalog');
    // showCatalog(_domElement);
}
