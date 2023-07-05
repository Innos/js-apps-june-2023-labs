import { logout } from "./logout.js";
import { isUserLoggedIn } from "./services/authenticationService.js";
import { showCatalog } from "./views/catalogPage.js";
import { showCreateRecipe } from "./views/createRecipePage.js";
import { showEditPage } from "./views/editRecipePage.js";
import { showLogin } from "./views/loginPage.js";
import { showRegister } from "./views/registerPage.js";

let _domElement = undefined;
let _navElement = undefined;

let views = {
    catalog: () => {
        showNavigation(_navElement)
        showCatalog(_domElement, navigate)
    },
    createRecipe: () => {
        showNavigation(_navElement)
        showCreateRecipe(_domElement, navigate)
    },
    editRecipe: (id) => {
        showNavigation(_navElement)
        showEditPage(_domElement, id, navigate)
    },
    login: () => {
        showNavigation(_navElement)
        showLogin(_domElement, navigate)
    },
    register: () => {
        showNavigation(_navElement)
        showRegister(_domElement, navigate)
    },
    logout: () => {
        showNavigation(_navElement)
        logout(navigate)
    }
};

export function init(domElement, navElement) {
    _domElement = domElement;
    _navElement = navElement;
}

export async function navigate(pageName, id) {
    if (views[pageName]) {
        views[pageName](id);
    } else {
        views['catalog']();
    }
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
        catalogLink.addEventListener('click', views.catalog);
        createPageLink.addEventListener('click', views.createRecipe);
        logoutLink.addEventListener('click', views.logout);
    } else {
        navElement.innerHTML = `<a id="catalogLink" class="active" href="javascript:void(0)">Catalog</a>
        <div id="guest">
            <a id="loginLink" href="javascript:void(0)">Login</a>
            <a id="registerLink" href="javascript:void(0)">Register</a>
        </div>`;
        let catalogLink = navElement.querySelector('#catalogLink');
        let loginLink = navElement.querySelector('#loginLink');
        let registerLink = navElement.querySelector('#registerLink');
        catalogLink.addEventListener('click', views.catalog);
        loginLink.addEventListener('click', views.login);
        registerLink.addEventListener('click', views.register);
    }
}
