import { createElement } from "../util.js";
import * as recipeService from '../services/recipeService.js';
import { html } from '../../node_modules/lit-html/lit-html.js';

let allRecipePreviewsTemplate = (recipes, toggleCard) => html`
<section id="catalog">
    ${recipes.map(r => r.ingredients === undefined
        ? recipePreviewTemplate(r, toggleCard)
        : recipeCardTemplate(r)
    )}
</section>`;

let recipePreviewTemplate = (recipe, toggleCard) => html`
<article class="preview" @click=${() => toggleCard(recipe._id)}>
    <div class="title">
        <h2>${recipe.name}</h2>
    </div>
    <div class="small">
        <img src=${recipe.img}>
    </div>
</article>`;

// Add edit button functionality
let recipeCardTemplate = (recipe) => html`
<article>
    <h2>${recipe.name}</h2>
    <div class="band">
        <div class="thumb">
            <img src=${recipe.img}>
        </div>
        <div class="ingredients">
            <h3>Ingredients:</h3>
            <ul>
                ${recipe.ingredients.map(i => html`<li>${i}</li>`)}
            </ul>
        </div>
    </div>
    <div class="description">
        <h3>Preparation:</h3>
        ${recipe.steps.map(s => html`<p>${s}</p>`)}
    </div>
    <button>Edit</button>
</article>`;

let _navigate = undefined;
let _detailedRecipes = [];
export async function showCatalog(navigate, detailedRecipes) {
    _navigate = navigate;
    _detailedRecipes = Array.isArray(detailedRecipes) ? detailedRecipes : [];
    let recipes = await recipeService.getRecipesWithSelectedColumns(['_id', 'name', 'img']);

    let recipesPromises = recipes.map(r => {
        if (_detailedRecipes.includes(r._id)) {
            return recipeService.getRecipeById(r._id);
        }

        return r;
    });

    recipes = await Promise.all(recipesPromises);

    let template = allRecipePreviewsTemplate(recipes, toggleCard);
    return template;
}

async function toggleCard(id) {
    _detailedRecipes.push(id);
    _navigate('catalog', _detailedRecipes);
}

async function goToEdit(id) {
    _navigate('editRecipe', id);
}