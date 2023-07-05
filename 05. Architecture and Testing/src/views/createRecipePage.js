import { createElement } from "../util.js";
import * as recipeService from "../services/recipeService.js";

let _domElement = undefined;
let _navigate = undefined;
export async function showCreateRecipe(domElement, navigate) {
    _navigate = navigate;
    _domElement = domElement;
    domElement.innerHTML = '';
    let form = createCreateRecipeForm();
    domElement.appendChild(form);

    form.addEventListener('submit', createRecipe);
}

function createCreateRecipeForm() {
    const result = createElement('article',
        createElement('h2', undefined, 'New Recipe'),
        createElement('form', undefined,
            createElement('label', undefined, ['Name:', createElement('input', { type: 'text', name: 'name', placeholder: 'Recipe Name' })]),
            createElement('label', undefined, ['Image:', createElement('input', { type: 'text', name: 'img', placeholder: 'Image URL' })]),
            createElement('label', { class: 'ml' }, ['Ingredients:', createElement('textarea', { name: 'ingredients', placeholder: 'Enter ingredients on separate lines' })]),
            createElement('label', { class: 'ml' }, ['Preparation:', createElement('textarea', { name: 'steps', placeholder: 'Enter preparation steps on separate lines' })]),
            createElement('input', { type: 'submit', value: 'Create Recipe' }),
        ));

    return result;
}

async function createRecipe(e) {
    e.preventDefault();
    let form = e.target;
    let formData = new FormData(form);

    // let url = 'http://localhost:3030/data/recipes';

    let name = formData.get('name');
    let img = formData.get('img');
    let ingredients = formData.get('ingredients').split('\n');
    let steps = formData.get('steps').split('\n');

    let result = await recipeService.createRecipe({name, img, ingredients, steps});

    _navigate('catalog');
}