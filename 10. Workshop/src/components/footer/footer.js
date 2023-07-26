import { LitElement, css, html } from "lit";

class FooterComponent extends LitElement {
    static styles = css`
    footer {
        background-color: #7d7e7e;
        color: white;
        font-weight: bolder;
        text-align: center;
        padding: 10px;
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 30px;
      }`;


    render() {
        return html`
    <footer>
        <p>@SoleMates</p>
    </footer>`;
    }
}
customElements.define('footer-component', FooterComponent);