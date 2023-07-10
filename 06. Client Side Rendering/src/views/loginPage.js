import { html } from '../../node_modules/lit-html/lit-html.js';
import * as userService from '../services/usersService.js';

let loginTemplate = (login) => html`
<article id="login">
    <h2>Login</h2>
    <form @submit=${login}>
        <label>E-mail: <input type="text" name="email"></label>
        <label>Password: <input type="password" name="password"></label>
        <input type="submit" value="Login">
    </form>
</article>`;

let _navigate = undefined;
export async function showLogin(navigate) {
    _navigate = navigate;

    let template = loginTemplate(login);
    return template;
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
}
