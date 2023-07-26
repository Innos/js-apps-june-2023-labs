import { LitElement, css, html } from "lit";

import '../shared/listComponent.js';
import './orderItem.js';

class OrdersPage extends LitElement {
    static styles = css`
    .title {
        text-align: center;
    }
    `;

    static properties = {
        ordersService: {type: Object},
        orderItemsService: {type: Object},
        orders: {type: Array}
    }

    constructor() {
        super();
        this.ordersService = undefined;
        this.orderItemsService = undefined;
        this.orders = [];
    }

    async connectedCallback() {
        super.connectedCallback();
        let myOrders = await this.ordersService.getAllByUser();
        let count = myOrders.length;
        myOrders.forEach((x, i) => {
            x.number =  count - i;
            x.date = new Date(x._createdOn);
        });

        this.orders = myOrders;
        console.log(this.orders);
    }


    render() {
        return html`
        <section id="orders">
            <h2 class="title">My Orders:</h2>
            <list-component>
                ${(this.orders).map(x => html`<order-item .order=${x} .orderItemsService=${this.orderItemsService}></order-item>`)}
            </list-component>
        </section>`;
    }
}
customElements.define('orders-page', OrdersPage);