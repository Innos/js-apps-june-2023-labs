import { createElement } from "../util.js";
import * as recipeService from '../services/recipeService.js';

let _domElement = undefined;
let _navigate = undefined;
export async function showCatalog(domElement, navigate) {
    _domElement = domElement;
    domElement.innerHTML = '';
    _navigate = navigate;

    const recipes = await recipeService.getRecipesWithSelectedColumns(['_id', 'name', 'img']);
    const cards = recipes.map(createRecipePreview);
    cards.forEach(c => domElement.appendChild(c));
}

function createRecipePreview(recipe) {
    const result = createElement('article', { className: 'preview', onClick: toggleCard },
        createElement('div', { className: 'title' }, createElement('h2', {}, recipe.name)),
        createElement('div', { className: 'small' }, createElement('img', { src: recipe.img })),
    );

    return result;

    async function toggleCard() {
        const fullRecipe = await recipeService.getRecipeById(recipe._id);
        result.replaceWith(createRecipeCard(fullRecipe));
    }
}

function createRecipeCard(recipe) {
    const result = createElement('article', {},
        createElement('h2', {}, recipe.name),
        createElement('div', { className: 'band' },
            createElement('div', { className: 'thumb' }, createElement('img', { src: recipe.img })),
            createElement('div', { className: 'ingredients' },
                createElement('h3', {}, 'Ingredients:'),
                createElement('ul', {}, recipe.ingredients.map(i => createElement('li', {}, i))),
            )
        ),
        createElement('div', { className: 'description' },
            createElement('h3', {}, 'Preparation:'),
            recipe.steps.map(s => createElement('p', {}, s))
        ),
        createElement('button', {onClick: () => _navigate('editRecipe', recipe._id)}, 'Edit') //Should only show for the users that are owners
    );

    return result;
}