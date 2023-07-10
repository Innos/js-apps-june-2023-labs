import { logout } from "./logout.js";
import { isUserLoggedIn } from "./services/authenticationService.js";
import { showCatalog } from "./views/catalogPage.js";
import { showCreateRecipe } from "./views/createRecipePage.js";
import { showEditPage } from "./views/editRecipePage.js";
import { showLogin } from "./views/loginPage.js";
import { showRegister } from "./views/registerPage.js";
import { render } from '../node_modules/lit-html/lit-html.js';

let _domElement = undefined;
let _navElement = undefined;

let views = {
    catalog: async (extraParams) => {
        showNavigation(_navElement)
        return await showCatalog(navigate, ...extraParams);
    },
    createRecipe: async (extraParams) => {
        showNavigation(_navElement)
        return await showCreateRecipe(navigate, ...extraParams);
    },
    //TODO: Refactor everything to use lit-html templates, because _domElement.innerHtml ='' will break lit
    editRecipe: (extraParams) => {
        showNavigation(_navElement)
        showEditPage(_domElement, navigate, ...extraParams)
    },
    login: async (extraParams) => {
        showNavigation(_navElement)
        return await showLogin(navigate, extraParams)
    },
    //TODO: Refactor everything to use lit-html templates, because _domElement.innerHtml ='' will break lit
    register: (extraParams) => {
        showNavigation(_navElement)
        showRegister(_domElement, navigate, ...extraParams)
    },
    //TODO: Refactor everything to use lit-html templates, because _domElement.innerHtml ='' will break lit
    logout: (extraParams) => {
        showNavigation(_navElement)
        logout(navigate, ...extraParams)
    }
};

export function init(domElement, navElement) {
    _domElement = domElement;
    _navElement = navElement;
}

export async function navigate(pageName, ...extraParams) {
    let template = views[pageName]
        ? await views[pageName](extraParams)
        : await views['catalog'](extraParams);
    //Lit will track _domElement so it can efficiently render changes, if we delete the elements html
    // by using _domElement.innerHtml = '', this will break the existing pages rendered using lit templates
    render(template, _domElement);
}

async function showNavigation(navElement) {
    if (isUserLoggedIn()) {
        navElement.innerHTML = `<a id="catalogLink" class="active" href="javascript:void(0)">Catalog</a>
        <div id="user">
            <a id="createRecipeLink" href="javascript:void(0)">Create Recipe</a>
            <a id="logoutBtn" href="javascript:void(0)">Logout</a>
        </div>`;
        let catalogLink = navElement.querySelector('#catalogLink');
        let createPageLink = navElement.querySelector('#createRecipeLink');
        let logoutLink = navElement.querySelector('#logoutBtn');
        catalogLink.addEventListener('click', () => navigate('catalog', []));
        createPageLink.addEventListener('click', () => navigate('createRecipe'));
        logoutLink.addEventListener('click', () => navigate('logout'));
    } else {
        navElement.innerHTML = `<a id="catalogLink" class="active" href="javascript:void(0)">Catalog</a>
        <div id="guest">
            <a id="loginLink" href="javascript:void(0)">Login</a>
            <a id="registerLink" href="javascript:void(0)">Register</a>
        </div>`;
        let catalogLink = navElement.querySelector('#catalogLink');
        let loginLink = navElement.querySelector('#loginLink');
        let registerLink = navElement.querySelector('#registerLink');
        catalogLink.addEventListener('click', () => navigate('catalog', []));
        loginLink.addEventListener('click', () => navigate('login'));
        registerLink.addEventListener('click', () => navigate('register'));
    }
}
