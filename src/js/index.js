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

        // Search for recepies
        await state.search.getResults();

        // Render fetched results on UI
        clearLoader();
        searchView.renderResults(state.search.result);
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
