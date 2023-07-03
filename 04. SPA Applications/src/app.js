import { showCatalog } from "./catalogPage.js";
import { showCreateRecipe } from "./createRecipePage.js";
import { showLogin } from "./loginPage.js";
import { logout } from "./logout.js";
import { showRegister } from "./registerPage.js";

const main = document.querySelector('main');

main.innerHTML = '';

let links = {
    catalogLink: document.getElementById('catalogLink'),
    createPageLink: document.getElementById('createRecipeLink'),
    loginLink: document.getElementById('loginLink'),
    registerLink: document.getElementById('registerLink'),
    logoutLink: document.getElementById('logoutBtn')
}

links.catalogLink.addEventListener('click', () => showCatalog(main));
links.createPageLink.addEventListener('click', () => showCreateRecipe(main));
links.loginLink.addEventListener('click', () => showLogin(main));
links.registerLink.addEventListener('click', () => showRegister(main));
links.logoutLink.addEventListener('click', () => logout(main));

showCatalog(main);