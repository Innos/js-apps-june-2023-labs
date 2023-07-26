import { LitElement, css, html } from "lit";

class NavComponent extends LitElement {
    static styles = css`
    .header-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.3em 3em;
        background: #7d7e7e;
    }
    
    nav {
        background-color: #7a6e6e;
        height: 0px;
        margin-bottom: 15px;
        display: flex;
        justify-content: space-between;
        color: aliceblue;
    }
    
    #logo {
        font-style: italic;
        font-size: 30px;
    }
    
    #logo-img {
        height: 70px;
    }
    
    nav a {
        font-size: 1.5rem;
        color: #0a0a0a;
        font-weight: 400;
    }
    
    header a {
        padding: 0 10px;
        text-decoration: none;
        color: aliceblue;
    }
    
    header a:hover {
        color: rgb(202, 203, 204);
    }
    `;

    static properties = {
        authService: { type: Object },
        router: { type: Object },
        isUserLoggedIn: {type: Boolean}
    };

    constructor() {
        super();
        this.authService = undefined;
        this.router = undefined;
        this.logoutHandler = this._logoutHandler.bind(this);
        this.isUserLoggedIn = undefined;
    }

    connectedCallback() {
        super.connectedCallback();
        this.updateUser();
    }

    async _logoutHandler() {
        await this.authService.logout();
        this.updateUser();
        this.router.navigate('/shop');
    }

    updateUser() {
        this.isUserLoggedIn = this.authService.isUserLoggedIn();
    }

    render() {
        return html`
        <header>
            <div class="header-container">
            <a id="logo" href="/">
                <img id="logo-img" src="/images/logo.png" alt=""/>
            </a>
            <nav>
                <div>
                <a href="/shop">Shop</a>
                </div>
                ${this.isUserLoggedIn
                ? html`
                    <div class="user">
                        <!-- <a href="/create">Add Pair</a> -->
                        <a href="/orders">My Orders</a>
                        <a href="javascript:void(0)" @click=${this.logoutHandler}>Logout</a>
                    </div>`
                : html`
                    <div class="guest">
                        <a href="/login">Login</a>
                        <a href="/register">Register</a>
                    </div>`
            }
                </nav>
            </div>   
        </header>
    `;
    }
}
customElements.define('nav-component', NavComponent);