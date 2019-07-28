import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
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
            alert('Failed to get recipes from search query using Food2Fork. See console log for more details.');
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

        state.recipe = new Recipe(id);

        try {
            // Get recipe data
            await state.recipe.getRecipe();

            state.recipe.calculatePreparingTime();
            state.recipe.calculateServings();

            console.log(state.recipe);
        } catch(error) {
            alert('Failed to get receipe details from Food2Fork. See console log for more details.');
            console.log(error);
        }
    }
}

 ['hashchange', 'load'].forEach(event => window.addEventListener(event,controlRecipe));