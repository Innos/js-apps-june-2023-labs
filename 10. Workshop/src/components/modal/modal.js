import { LitElement, css, html } from "lit";

class ModalComponent extends LitElement {
    static styles = css`
        .overlay {
            background-color: rgba(100, 100, 100, 0.5);
            backdrop-filter: blur;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 100;
        }
        
        .modal {
            width: 800px;
            height:750px;
            margin: auto;
            margin-top:  100px;
            text-align: center;
            background-color: white;
            padding: 32px;
        }
    `;

    render() {
        return html`
        <div class="overlay">
            <div class="modal">
                <slot></slot>
            </div>
        </div>
    `;
    }
}
customElements.define('modal-component', ModalComponent);