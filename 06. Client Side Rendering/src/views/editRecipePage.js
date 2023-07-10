import { showCatalog } from "./catalogPage.js";
import { createElement } from "../util.js";
import * as recipeService from "../services/recipeService.js";

let _navigate = undefined;
export async function showEditPage(navigate, id) {
    _navigate = navigate;
    //breaks lit-html refactor into lit-html template
    domElement.innerHTML = '';

    let result = await recipeService.getRecipeById(id);
    console.log(result);
    let form = createCreateRecipeForm(result);
    domElement.appendChild(form);

    form.addEventListener('submit', (e) => editRecipe(e, id));
}

function createCreateRecipeForm(recipe) {
    const result = createElement('article',
        createElement('h2', undefined, 'Edit Recipe'),
        createElement('form', undefined,
            createElement('label', undefined, ['Name:', createElement('input', { type: 'text', name: 'name', placeholder: 'Recipe Name', value: recipe.name })]),
            createElement('label', undefined, ['Image:', createElement('input', { type: 'text', name: 'img', placeholder: 'Image URL', value: recipe.img })]),
            createElement('label', { class: 'ml' }, ['Ingredients:', createElement('textarea', { name: 'ingredients', placeholder: 'Enter ingredients on separate lines', value: recipe.ingredients.join('\n') })]),
            createElement('label', { class: 'ml' }, ['Preparation:', createElement('textarea', { name: 'steps', placeholder: 'Enter preparation steps on separate lines', value: recipe.steps.join('\n') })]),
            createElement('input', { type: 'submit', value: 'Edit Recipe' }),
        ));

    return result;
}

async function editRecipe(e, id) {
    e.preventDefault();
    let form = e.target;
    let formData = new FormData(form);

    let name = formData.get('name');
    let img = formData.get('img');
    let ingredients = formData.get('ingredients').split('\n');
    let steps = formData.get('steps').split('\n');

    let recipe = { _id: id, name, img, ingredients, steps };
    let result = await recipeService.editRecipe(recipe, id);

    _navigate('catalog');
    // showCatalog(_domElement);
}