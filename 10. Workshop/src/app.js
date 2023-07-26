import { LitElement, css, html } from "lit";
import page from "../node_modules/page/page.mjs";

import './components/nav/nav.js';
import './components/footer/footer.js';
import './components/home/home.js';
import './components/shop/shop.js';
import './components/shoppingCart/shoppingCart.js';
import './components/login/login.js';
import './components/checkout/checkout.js';
import './components/orders/orders.js';
import './components/dice/dice.js';

import { AuthService } from "./services/AuthService.js";
import { BaseCrudApiService } from "./services/BaseCrudApiService.js";
import { SessionService } from "./services/SessionService.js";
import { ShoppingCartService } from "./services/ShoppingCartService.js";

//Router
let router = {
    navigate: page.show,
    redirect: page.redirect
}

//Base Url
const baseUrl = 'http://localhost:3030';

//Service
let sessionService = new SessionService();
let authService = new AuthService(baseUrl, sessionService);
let shoesService = new BaseCrudApiService(baseUrl, '/data/shoes', sessionService);
let ordersService = new BaseCrudApiService(baseUrl, '/data/orders', sessionService);
let orderItemsService = new BaseCrudApiService(baseUrl, '/data/orderItems', sessionService);
let shoppingCartService = new ShoppingCartService();

class MainApp extends LitElement {
    static styles = css`
    nav-component {
        position:fixed;
        width: 100%;
        top:0;
    }

    footer-component {
        position:fixed;
        bottom: 0;
        width: 100%;
    }

    #content {
        margin-top: 85px;
        margin-bottom: 50px;
        display: grid;
        grid-template-columns: 0fr 5fr;
    }
    
    aside {
        padding-right: 75px;
    }`;

    static properties = {
        currentComponent: { type: Object },
        shoppingCartItems: {type: Array}
    };

    constructor() {
        super();
        this.currentComponent = undefined;
        this.showHomepage = this._showHomepage.bind(this);
        this.showShop = this._showShop.bind(this);
        this.showLogin = this._showLogin.bind(this);
        this.showCheckout = this._showCheckout.bind(this);
        this.showOrders = this._showOrders.bind(this);
        this.userChangedHandler = this._userChangedHandler.bind(this);
        this.refreshShoppingCart = this._refreshShoppingCart.bind(this);
    }

    _showHomepage() {
        this.currentComponent = html`<home-component .shoeService=${shoesService}></home-component>`;
    }

    _showShop() {
        this.currentComponent = html`<shop-component .shoeService=${shoesService} .shoppingCartService=${shoppingCartService}></shop-component>`;
    }

    _showLogin() {
        this.currentComponent = html`<login-component .authService=${authService} .router=${router}></login-component>`;
    }

    _showCheckout() {
        this.currentComponent = html`<checkout-component 
        .shoppingCartService=${shoppingCartService} 
        .ordersService=${ordersService} 
        .orderItemsService=${orderItemsService}
        .router=${router}></checkout-component>`;
    }

    _showOrders(){
        this.currentComponent = html`<orders-page
        .ordersService=${ordersService} 
        .orderItemsService=${orderItemsService}
        .router=${router}></orders-page>`;
    }

    _refreshShoppingCart(e){
        let shoppingCart = this.shadowRoot.querySelector('shopping-cart');
        shoppingCart.updateItems();
    }

    _userChangedHandler(e){
        console.log('event caught');
        let nav = this.shadowRoot.querySelector('nav-component');
        nav.updateUser();
    }

    render() {
        return html`<div @refreshShoppingCart=${this.refreshShoppingCart} @userChanged=${this.userChangedHandler} id="wrapper">
        <nav-component .authService=${authService} .router=${router}></nav-component>
        <div id="content">
            <aside>
                <shopping-cart .shoppingCartService=${shoppingCartService}></shopping-cart>
            </aside>
            <main>
                ${this.currentComponent}
            </main>
        </div>

        <footer-component></footer-component>
      </div>`;
    }
}
customElements.define('main-app', MainApp);

let mainApp = document.querySelector('main-app');


//Routing
page('/index.html', '/');
// page(navComponent.showView);

page('/', mainApp.showHomepage);
page('/login', mainApp.showLogin);
page('/checkout', mainApp.showCheckout);
page('/shop', mainApp.showShop);
page('/orders', mainApp.showOrders);
// page('/create', createComponent.showView);
// page('/details/:id', detailsComponent.showView);
// page('/edit/:id', editComponent.showView);
// page('/search', searchComponent.showView);
page.start();

