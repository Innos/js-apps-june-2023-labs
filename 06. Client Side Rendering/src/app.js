import { showCatalog } from "./views/catalogPage.js";
import { showCreateRecipe } from "./views/createRecipePage.js";
import { showLogin } from "./views/loginPage.js";
import { logout } from "./logout.js";
import { showRegister } from "./views/registerPage.js";
import { init, navigate } from "./nav.js";

const main = document.querySelector('main');
const navElement = document.querySelector('nav');
main.innerHTML = '';


init(main, navElement);
navigate('catalog');