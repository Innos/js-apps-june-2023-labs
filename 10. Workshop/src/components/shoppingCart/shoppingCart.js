import { LitElement, css, html } from "lit";

import '../shared/listComponent.js';
import '../shared/shopCartItem.js';

class ShoppingCart extends LitElement {
    static styles = css`
    #slider {
        position: fixed;
        width: 400px;
        height: 75%;
        padding: 10px 0px;
        background: rgb(200, 200, 200);
        border: 2px solid black;
    }

    #slider h2 {
        text-align: center;
        margin: 10px;
        border: 1px solid grey;
        background: white;
        padding: 5px;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2), 0 3px 3px 0 rgba(0, 0, 0, 0.24);
    }

    #slider a {
        text-align: center;
        font-weight: bold;
        font-size: 30px;
        margin: 10px;
        border: 1px solid grey;
        background: cornsilk;
        padding: 5px;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2), 0 3px 3px 0 rgba(0, 0, 0, 0.24);
        display: block;
        text-decoration: none;
        color: black;
        cursor: pointer;
    }

    .slide-in {
        animation: slide-in 0.5s forwards;
        -webkit-animation: slide-in 0.5s forwards;
    }
    
    .slide-out {
        animation: slide-out 0.5s forwards;
        -webkit-animation: slide-out 0.5s forwards;
    }
        
    @keyframes slide-in {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(0%); }
    }
    
    @-webkit-keyframes slide-in {
        0% { -webkit-transform: translateX(-100%); }
        100% { -webkit-transform: translateX(0%); }
    }
        
    @keyframes slide-out {
        0% { transform: translateX(0%); }
        100% { transform: translateX(-100%); }
    }
    
    @-webkit-keyframes slide-out {
        0% { -webkit-transform: translateX(0%); }
        100% { -webkit-transform: translateX(-100%); }
    }

    .cart-wrapper {
        position:relative;
        width: 0px;
        height: 0px;
        top: 35%;
        left: 100%;
    }

    #cart {
        font-size: 35px;
        position: absolute;
        padding: 10px;
        border: 5px solid blue;
        background-color: blue;
        border-radius: 70px;
        width: 50px;
    }
    
    .slider-content {
        height: 100%;
        overflow-y:scroll;
        overflow-x:hidden;
    }  
    `;

    static properties = {
        shoppingCartService: { type: Object },
        shoppingCartItems: { type: Object },
        sliderClass: { type: String }
    }

    constructor() {
        super();
        this.toggle = this._toggle.bind(this);
        this.sliderClass = 'slide-out';
        this.shoppingCartService = undefined;
        this.shoppingCartItems = [];
        this.updateItems = this._updateItems.bind(this);
    }

    _updateItems(){
        this.shoppingCartItems = this.shoppingCartService.getShoppingCartItems();
    }

    connectedCallback() {
        super.connectedCallback();
        this.updateItems();
    }

    _toggle() {
        this.sliderClass = this.sliderClass === 'slide-in' ? 'slide-out' : 'slide-in';
    }

    totalPrice(){
        return this.shoppingCartItems.map(x => ({value: Number(x.item.value), quantity: x.quantity})).reduce((a,c) => a + (c.value * c.quantity),0);
    }

    render() {
        return html`
        <div id="slider" class=${this.sliderClass}>
        <div class="cart-wrapper">
            <div id="cart" @click=${this.toggle}>🛒</div>
        </div>
            <div class="slider-content">
                <h2>Shopping Cart</h2>
                <list-component>
                    ${(this.shoppingCartItems).map(x => html`<shopcart-item .shopItem=${x.item} .quantity=${x.quantity} ></shopcart-item>`)}
                </list-component>
                <h2>Total Price: ${this.totalPrice()} $</h2>
                <a href="/checkout">Checkout</a>
            </div>
        </div>`;
    }
}
customElements.define('shopping-cart', ShoppingCart);