import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';

/** Global state of the app
 * - Search object
 * - Current receipe object
 * - Shopping list object
 * - Liked receipes
 */
const state = {};

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