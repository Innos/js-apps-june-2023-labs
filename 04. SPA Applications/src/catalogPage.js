import { showEditPage } from "./editRecipePage.js";
import { createElement } from "./util.js";

let _domElement = undefined;
export async function showCatalog(domElement) {
    _domElement = domElement;
    domElement.innerHTML = '';
    const recipes = await getRecipesWithSelectedColumns(['_id', 'name', 'img']);
    const cards = recipes.map(createRecipePreview);

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

    cards.forEach(c => domElement.appendChild(c));
}

// async function getRecipes() {
//     const response = await fetch('http://localhost:3030/data/recipes');
//     const recipes = await response.json();

//     return Object.values(recipes);
// }

async function getRecipesWithSelectedColumns(columns) {
    let columnsString = columns.join(',');
    let encodedPart = encodeURIComponent(columnsString);
    console.log(encodedPart);
    const response = await fetch(`http://localhost:3030/data/recipes?select=${encodedPart}`);
    const recipes = await response.json();

    return Object.values(recipes);
}

async function getRecipeById(id) {
    const response = await fetch('http://localhost:3030/data/recipes/' + id);
    const recipe = await response.json();

    return recipe;
}


function createRecipePreview(recipe) {
    const result = createElement('article', { className: 'preview', onClick: toggleCard },
        createElement('div', { className: 'title' }, createElement('h2', {}, recipe.name)),
        createElement('div', { className: 'small' }, createElement('img', { src: recipe.img })),
    );

    return result;

    async function toggleCard() {
        const fullRecipe = await getRecipeById(recipe._id);

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
        createElement('button', {onClick: () => showEditPage(_domElement, recipe._id)}, 'Edit')
    );

    return result;
}