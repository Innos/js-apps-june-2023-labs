import { LitElement, css, html } from "lit";
import { UserReadableError } from "../../errors/UserReadableError.js";

class LoginComponent extends LitElement {
    static styles = css`  
    .login-page {
        width: 360px;
        padding: 8% 0 0;
        margin: auto;
    }
    .form {
        background: #ffffff;
        max-width: 460px;
        margin: auto;
        margin-top: 100px;
        padding: 45px;
        text-align: center;
        border-radius: 30px;
        box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
    }
    
    .form h2 {
        margin-top: 0px;
        margin-bottom: 30px;
        font-size: 30px;
    }
    
    .form input {
        font-family: "Roboto", sans-serif;
        outline: 0;
        background: #f2f2f2;
        width: 90%;
        height: 50px;
        border: 0;
        margin: 0 0 15px;
        padding: 15px;
        border-radius: 10px;
        box-sizing: border-box;
        font-size: 14px;
        text-align: center;
    }
    .form textarea {
        border: 1px solid rgb(206, 206, 206);
        width: 90%;
        max-width: 99%;
        min-width: 90%;
        min-height: 50px;
        margin-bottom: 10px;
        background-color: rgb(242, 242, 242);
    }
    .form button {
        font-family: "Roboto", sans-serif;
        text-transform: uppercase;
        font-weight: bold;
        outline: 0;
        background: #989999;
        width: 50%;
        border: 0;
        padding: 15px;
        color: #ffffff;
        font-size: 14px;
        border-radius: 10px;
        -webkit-transition: all 0.3 ease;
        transition: all 0.3 ease;
        cursor: pointer;
    }
    .form button:hover,
    .form button:active,
    .form button:focus {
        background: #737474;
    }
    `;

    static properties = {
        authService: { type: Object },
        router: { type: Object }
    };

    constructor() {
        super();
        this.authService = undefined;
        this.router = undefined;
        this.submitHandler = this._submitHandler.bind(this);
    }

    async _submitHandler(e) {
        e.preventDefault();
        let form = e.target;
        let formData = new FormData(form);

        let email = formData.get('email');
        let password = formData.get('password');

        if (email == '' || password == '') {
            alert('Email and Password must not be empty');
            return;
        }

        let user = { email, password };
        try {
            let result = await this.authService.login(user);
            console.log('userChanged Called');
            let event = new CustomEvent('userChanged', {
              detail: {
                item: user
              },
              bubbles: true,
              composed: true
            });
            this.dispatchEvent(event);
            this.router.navigate('/shop');
        } catch (e) {
            if (e instanceof UserReadableError) {
                alert(e.message);
            }
        }
    }

    render() {
        return html`
    <section id="login">
        <div class="form">
        <h2>Login</h2>
        <form class="login-form" @submit=${this.submitHandler}>
            <input type="text" name="email" id="email" placeholder="email" />
            <input type="password" name="password" id="password" placeholder="password" />
            <button type="submit">login</button>
            <p class="message">
            Not registered? <a href="/register">Create an account</a>
            </p>
        </form>
        </div>
    </section>
    `;
    }
}
customElements.define('login-component', LoginComponent);