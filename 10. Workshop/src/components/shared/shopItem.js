import { LitElement, css, html } from "lit";

class ShopItem extends LitElement {
  static styles = css`
  .card {
      display: grid;
      grid-template-columns: 3fr 12fr 5fr;
      margin: 25px auto;
      background-color: white;
      border-radius: 5px;
      border: 2px ridge rgb(210, 208, 208);
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2), 0 3px 3px 0 rgba(0, 0, 0, 0.24);
    }

    .control-section {
      display: grid;
      grid-template-columns: 1fr;
    }

    .info-section {
      display: grid;
      grid-template-rows: auto;
    }

    .details-btn {
      text-decoration: none;
      margin: auto;
      font-size: 21px;
      padding: 10px;
      text-align: center;
      color: white;
      background: #7c7e7e;
      cursor: pointer;
    }
    
    .card p {
      min-width: 90% !important;
      margin: auto;
      font-size: 21px;
      max-height: 50px;
      max-width: 30%;
      text-align: center;
    }
    
    .card span {
      padding: 10px;
      margin: auto;
    }

    h2 {
      text-align: center;
      font-size: 40px;
    }
    
    .card img {
      margin: auto;
      width: 100px;
    }
    
    .card-wrapper h2 {
      margin: auto;
    }     
    `;

  static properties = {
    shoeService: { type: Object },
    shoppingCartService: { type: Object },
    shopItem: { type: Object },
  };

  constructor() {
    super();
    this.shoeService = undefined;
    this.shoppingCartService = undefined;
    this.shopItem = undefined;
    this.toggle = this._toggle.bind(this);
  }

  async _toggle(id) {
    this.detailedShoe = await this.shoeService.getById(id);
  }

  addToCart() {
    this.shoppingCartService.addShoppingCartItem(this.shopItem);
    console.log('addToCart called');
    let event = new CustomEvent('refreshShoppingCart', {
      detail: {
        item: this.shopItem
      },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }

  render() {
    return html`
      <li class="card">
          <img src=${this.shopItem.imageUrl} alt="travis" />
          <div class="info-section">
            <p>
                <strong>Brand: </strong><span class="brand">${this.shopItem.brand}</span>
            </p>
            <p>
                <strong>Model: </strong><span class="model">${this.shopItem.model}</span>
            </p>
            <p><strong>Value:</strong><span class="value">${this.shopItem.value}</span>$</p>
          </div>
          <div class="control-section">
            <a class="details-btn" @click=${this.addToCart}>Add to Cart</a>
          </div>
      </li>`;
  }
}
customElements.define('shop-item', ShopItem);