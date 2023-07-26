import { LitElement, css, html } from "lit";

import '../shared/listComponent.js';
import '../shared/shopCartItem.js';
import '../modal/modal.js';
import '../dice/dice.js';
import { UserReadableError } from "../../errors/UserReadableError.js";

class CheckoutComponent extends LitElement {
    static styles = css`
    h2.title {
        text-align: center;
    }

    .price-section {
        display: grid;
        grid-template-columns: 20% 20%;
        grid-gap: 60%;
        justify-contents: right;
    }

    .discount-section {
        color: green;
    }

    .price-section h2 {
        text-align: center;
    }

    button {
        background: cornsilk;
        width: 100%;
        padding: 20px;
        color: black;
        font-size: 30px;
    }

    button[disabled] {
        background: rgba(255, 248, 220, 0.5);
    }
    `;

    static properties = {
        shoppingCartService: { type: Object },
        ordersService: {type: Object},
        orderItemsService: {type: Object},
        shoppingCartItems: { type: Object },
        router: {type: Object},
        modal: {type: Object},
        discount: {type: Number},
        getDiscountDisabled: {type: Boolean},
    }

    constructor() {
        super();
        this.shoppingCartService = undefined;
        this.shoppingCartItems = [];
        this.ordersService = undefined;
        this.orderItemsService = undefined;
        this.router = undefined;
        this.modal = '';
        this.discount = 0;
        this.checkoutHandler = this._checkoutHandler.bind(this);
        this.discountHandler = this._discountHandler.bind(this);
        this.showDiscountModal = this._showDiscountModal.bind(this);
        this.getDiscountDisabled = false;
    }

    connectedCallback() {
        super.connectedCallback();
        this.shoppingCartItems = this.shoppingCartService.getShoppingCartItems();
    }

    basePrice() {
        return this.shoppingCartItems.map(x => ({value: Number(x.item.value), quantity: x.quantity})).reduce((a,c) => a + (c.value * c.quantity),0);
    }

    priceWithDiscount() {
        let price = this.basePrice();
        price = price * (100 - this.discount) / 100;
        return price;
    }

    async _checkoutHandler() {
        try {
            let order = {
                state: 'pending',
                basePrice: this.basePrice(),
                discount: this.discount,
                finalPrice: this.priceWithDiscount()
            };
            let orderResult = await this.ordersService.create(order);
            let promises = [];
            this.shoppingCartItems.forEach(i => {
                let item = {
                    orderId: orderResult._id,
                    itemId: i.item._id,
                    value: i.item.value,
                    quantity: i.quantity
                };
                let itemPromise = this.orderItemsService.create(item);
                promises.push(itemPromise);
            });
    
            await Promise.all(promises);
            this.shoppingCartService.clearShoppingCart();

            console.log('refreshShoppingCart called');
            let event = new CustomEvent('refreshShoppingCart', {
              detail: {
              },
              bubbles: true,
              composed: true
            });
            this.dispatchEvent(event);

            this.router.navigate('/shop');
        } catch (e) {
            if(e instanceof UserReadableError) {
                alert(e);
            }
        }  
    }

    async _discountHandler(){
        if(this.getDiscountDisabled === false) {
            this.getDiscountDisabled = true;
            let diceComponent = this.shadowRoot.querySelector('dice-component');
            let discount = await diceComponent.calculateDiscount();
            this.discount = discount;
            this.modal = '';
        }
    }


    _showDiscountModal() {
        this.getDiscountDisabled = false;
        this.modal = html`
        <modal-component>
            <button ?disabled=${this.getDiscountDisabled} @click=${this.discountHandler}>Get Discount</button>
            <dice-component></dice-component>
        </modal-component>`; 
    }


    render() {
        return html`
        <section id="checkout">
            <h2 class="title">Shopping Cart:</h2>
            <list-component>
                ${(this.shoppingCartItems).map(x => html`<shopcart-item .shopItem=${x.item} .quantity=${x.quantity} ></shopcart-item>`)}
            </list-component>
            <div class="price-section">
                <h2>Price:</h2>
                <h2>${this.basePrice()} $</h2>
            </div>
            <div class="price-section discount-section">
                <h2>Discount:</h2>
                <h2>${this.discount}%</h2>
            </div>
            <div class="price-section">
                <h2>Total Price:</h2>
                <h2>${this.priceWithDiscount()} $</h2>
            </div>
            <button @click=${this.checkoutHandler}>Create Order</button>
            <button ?disabled=${this.modal != ''} @click=${this.showDiscountModal}>Add discount</button>
            ${this.modal}
        </section>`;
    }
}
customElements.define('checkout-component', CheckoutComponent);