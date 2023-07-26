import { LitElement, css, html } from "lit";
import { until } from "lit/directives/until.js";

import '../shared/shopItem.js';
import '../shared/listComponent.js';


class ShopComponent extends LitElement {
    static styles = css`
    section {
        margin-bottom: 100px;
    }
      
    #dashboard {
        margin-top: 50px;
        display: block;
      }
      
      h2 {
        text-align: center;
        font-size: 40px;
      }
      
      .card img {
        margin: auto;
        height: 290px;
        width: 95%;
      }
      
      .card-wrapper {
        list-style-type: none;
        display: flex;
        flex-wrap: wrap;
      }
      
      .card-wrapper h2 {
        margin: auto;
      }
      
      .title,
      .salary {
        font-size: 21px;
      }
      
      .loading {
        font-size: 30px;
        text-align: center;
      }
      `;

    static properties = {
        shoeService: { type: Object },
        shoppingCartService: {type: Object},
        shoes: { type: Promise }
    };

    constructor() {
        super();
        this.shoeService = undefined;
        this.shoppingCartService = undefined;
        this.shoes = Promise.resolve([]);
    }

    async connectedCallback() {
        super.connectedCallback();
        this.shoes = this.shoeService.getAll();
    }

    render() {
        return html`
        <section id="dashboard">
        <h2>Products:</h2>
        ${until(
            this.shoes.then(shoesArr => shoesArr.length > 0
                ? html`
            <list-component>
                ${shoesArr.map(s => html`<shop-item .shoppingCartService=${this.shoppingCartService} .shopItem=${s} .shoeService=${this.shoeService}></shop-item>`)}
            </list-component>`
                : html`<h2>There are no items added yet.</h2>`),
            html`<p class="loading">Loading....</p>`)
        }     
    </section>`;
    }
}
customElements.define('shop-component', ShopComponent);