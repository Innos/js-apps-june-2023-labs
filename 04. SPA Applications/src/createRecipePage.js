import { showCatalog } from "./catalogPage.js";
import { createElement } from "./util.js";

let _domElement = undefined;
export async function showCreateRecipe(domElement) {
    _domElement = domElement;
    domElement.innerHTML = '';
    let form = createCreateRecipeForm();
    domElement.appendChild(form);

    form.addEventListener('submit', createRecipe);

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

    let url = 'http://localhost:3030/data/recipes';

    let name = formData.get('name');
    let image = formData.get('img');
    let ingredients = formData.get('ingredients').split('\n');
    let steps = formData.get('steps').split('\n');

    let settings = {
        method: 'Post',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': sessionStorage.getItem('accessToken')
        },
        body: JSON.stringify({
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