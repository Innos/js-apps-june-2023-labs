import { getAccessToken } from "./authenticationService.js";
import { _internalJsonFetch } from "./internalFetchService.js";

let url = 'http://localhost:3030/data/recipes'

export async function getRecipesWithSelectedColumns(columns) {
    let columnsString = columns.join(',');
    let encodedPart = encodeURIComponent(columnsString);
    try {
        const result = await _internalJsonFetch(`${url}?select=${encodedPart}`);
        return Object.values(result);
    } catch(e) {
        if(e instanceof UserReadableError) {
            alert(e.message);
        }
    }

}

export async function getRecipeById(id) {
    const result = await _internalJsonFetch(`${url}/${id}`);
    return result;
}

export async function createRecipe(recipe) {
    let settings = {
        method: 'Post',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': getAccessToken()
        },
        body: JSON.stringify(recipe)
    };

    let result = await _internalJsonFetch(url, settings);
    return result;
}

export async function editRecipe(recipe, id) {
    let settings = {
        method: 'Put',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': getAccessToken()
        },
        body: JSON.stringify(recipe)
    };

    let result = await _internalJsonFetch(`${url}/${id}`, settings);
    return result;
}
