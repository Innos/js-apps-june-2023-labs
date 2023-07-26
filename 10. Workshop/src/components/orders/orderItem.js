import { LitElement, css, html } from "lit";

import '../shared/shopCartItem.js';
import '../shared/listComponent.js';

class OrderItemComponent extends LitElement {
    static styles = css`
    .order {
        margin: 10px;
        border: 1px solid grey;
        background: light-grey;
        padding: 5px;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2), 0 3px 3px 0 rgba(0, 0, 0, 0.24);
        border-radius: 10px;
        cursor: pointer;
    }

    .order-content {
        display: grid;
        grid-template-columns: 1fr 6fr 3fr 3fr 3fr;
        justify-content: center;
    }

    .hidden {
        display: none;
    }
    `;

    static properties = {
        order: { type: Object },
        orderItemsService: {type: Object},
        orderItems: { type: Array },
        cardIsOpened: {type: Boolean}
    };

    constructor() {
        super();
        this.order = undefined;
        this.orderItems = [];
        this.orderItemsService = undefined;
        this.cardIsOpened = false;
        this.loadOrderItemsHandler = this._loadOrderItemsHandler.bind(this);
    }

    async _loadOrderItemsHandler(){
        if(this.cardIsOpened === false && this.orderItems.length === 0) {
            this.orderItems = await this.orderItemsService.getByOrder(this.order._id);
            this.orderItems.forEach(x => x.item.value = x.value);
        }

        this.cardIsOpened = !this.cardIsOpened;
    }

    render() {
        return html`
        <div class="order" @click=${this.loadOrderItemsHandler}>
            <div class="order-content">
                <h2>#${this.order.number}</h2>
                <h2>CreatedOn: ${this.order.date.toLocaleString()}</h2>
                <h2>Price: ${this.order.basePrice}</h2>
                <h2>Discount: ${this.order.discount}%</h2>
                <h2>Total Price: ${this.order.finalPrice}</h2>
            </div>
            <div class="orderItems ${this.cardIsOpened ? '' : 'hidden'}">
                <list-component>
                    ${this.orderItems.map(x => html`<shopcart-item .shopItem=${x.item} .quantity=${x.quantity}></shopcart-item>`)}
                </list-component>
            </div>
        </div>`;
    }
}
customElements.define('order-item', OrderItemComponent);