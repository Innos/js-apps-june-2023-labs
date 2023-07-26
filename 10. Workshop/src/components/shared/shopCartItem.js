import { LitElement, css, html } from "lit";

class ShopCartItem extends LitElement {
  static styles = css`
  .card {
      display: grid;
      grid-template-columns: 1fr 10fr 3fr;
      background-color: white;
      border-radius: 5px;
      border: 2px ridge rgb(210, 208, 208);
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2), 0 3px 3px 0 rgba(0, 0, 0, 0.24);
    }

    .info-section {
      display: grid;
      display: grid;
      grid-template-rows: 1fr;
    }

    .info-section p {
        padding: 10px 0;
    }

    .details-btn {
      text-decoration: none;
      margin: auto;
      font-size: 21px;
      padding: 10px;
      text-align: center;
      color: white;
      background: #7c7e7e;
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
      width: 80px;
    }
    
    .card-wrapper h2 {
      margin: auto;
    }    
    
    .quantity-section {
        display: grid;
        background-color: rgb(124, 126, 126);
    }
    `;

  static properties = {
    shopItem: { type: Object },
    quantity: {type: Number}
  };

  constructor() {
    super();
    this.shopItem = undefined;
    this.quantity = 0;
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
          <div class="quantity-section">
            <p>x${this.quantity}</p>
          </div>
      </li>`;
  }
}
customElements.define('shopcart-item', ShopCartItem);