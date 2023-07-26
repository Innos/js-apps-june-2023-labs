import { LitElement, css, html } from "lit";

class ListComponent extends LitElement {
  static styles = css` 
    .list {
        display: grid;
        grid-template-columns: 95%;
        justify-content: center;
        padding-left: 0px;
    }  
  `;

  render() {
    return html`
        <ul class="list">
            <slot></slot>
        </ul>
      `;
  }
}
customElements.define('list-component', ListComponent);