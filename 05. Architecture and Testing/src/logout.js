import { showCatalog } from "./views/catalogPage.js";
import * as userService from './services/usersService.js';

export async function logout(navigate) {
    await userService.logout();
    navigate('catalog');
    // showCatalog(domElement);
}