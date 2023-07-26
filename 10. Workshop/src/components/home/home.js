import { LitElement, css, html } from "lit";


class HomeComponent extends LitElement {
    static styles = css`
      section {
        margin-bottom: 100px;
      }
      
      #home {
        margin-top: 100px;
      }
      
      #home img {
        display: block;
        margin: auto;
        height: 30%;
        width: 30%;
        background-color: transparent;
      }
      
      #home h1 {
        font-style: italic;
        font-size: 39px;
        color: rgb(68, 67, 67);
        text-align: center;
      }
      
      #home h2,
      #home h3 {
        font-style: italic;
        font-size: 27px;
        color: rgb(68, 67, 67);
        text-align: center;
      }
      `;

    render() {
        return html`
    <section id="home">
        <h1>Welcome to Sole Mates</h1>
        <img src="/images/home.jpg" alt="home" />
        <h2>Browse through the shoe collectibles of our users</h2>
        <h3>Add or manage your items</h3>
    </section>`;
    }

}
customElements.define('home-component', HomeComponent);