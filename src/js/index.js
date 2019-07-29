import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, elementStrings, renderLoader, clearLoader } from './views/base';

/** Global state of the app
 * - Search object
 * - Current receipe object
 * - Shopping list object
 * - Liked receipes
 */
const state = {};

/**
 * SEARCH CONTROLLER
 */

const controlSearch = async () => {
    // Get query from view
    const query = searchView.getInput();

    if(query) {
        // Create new search object and add it to state
        state.search = new Search(query);

        // Clear previous search as well as search input
        searchView.clearResults();
        searchView.clearInput();
        renderLoader(elements.searchRes);

        try {
            // Search for recepies
            await state.search.getResults();

            // Render fetched results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch(error) {
            alert('Failed to get recipes from search query. See console log for more details. Be aware that number of daily allowed API request to Food2Fork can be reached');
            console.log(error);
        }
    }
}

document.querySelector('.search').addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const paginationButton = e.target.closest(`.${elementStrings.btnInline}`);
    
    if(paginationButton) {
        const goToPage = parseInt(paginationButton.dataset.goto, 10);

        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

/**
 * RECIPE CONTROLLER
 */

const controlRecipe = async () => {
    const id = window.location.hash.replace('#', '');
    
    if(id) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        if(state.search) 
            searchView.highlightSelected(id);

        state.recipe = new Recipe(id);
        
        try {
            // Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            state.recipe.calculatePreparingTime();
            state.recipe.calculateServings();

            clearLoader();
            recipeView.renderRecipe(state.recipe);
        } catch(error) {
            alert('Failed to get receipe details from Food2Fork. See console log for more details. Be aware that number of daily allowed API request to Food2Fork can be reached');
            console.log(error);
        }
    }
}

 ['hashchange', 'load'].forEach(event => window.addEventListener(event,controlRecipe));