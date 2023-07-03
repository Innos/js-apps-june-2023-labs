import { showCatalog } from "./catalogPage.js";
import { createElement } from "./util.js";

let _domElement = undefined;
export async function showEditPage(domElement, id) {
    _domElement = domElement;
    domElement.innerHTML = '';

    let url = `http://localhost:3030/data/recipes/${id}`;
    let response = await fetch(url);
    let result = await response.json();

    let form = createCreateRecipeForm(result);
    domElement.appendChild(form);

    form.addEventListener('submit', (e) => createRecipe(e, id));

    let accessToken = sessionStorage.getItem('accessToken');
    console.log(accessToken);
    let guest = document.getElementById('guest');
    let user = document.getElementById('user');
    if (accessToken == undefined) {
        guest.style.display = 'inline-block';
        user.style.display = 'none';
    } else {
        user.style.display = 'inline-block';
        guest.style.display = 'none';
    }
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

async function createRecipe(e, id) {
    e.preventDefault();
    let form = e.target;
    let formData = new FormData(form);

    let url = `http://localhost:3030/data/recipes/${id}`;

    let name = formData.get('name');
    let image = formData.get('img');
    let ingredients = formData.get('ingredients').split('\n');
    let steps = formData.get('steps').split('\n');

    let settings = {
        method: 'Put',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': sessionStorage.getItem('accessToken')
        },
        body: JSON.stringify({
            _id: id,
            name,
            img: image,
            ingredients,
            steps
        })
    };

    let response = await fetch(url, settings);
    let result = await response.json();

    showCatalog(_domElement);
}