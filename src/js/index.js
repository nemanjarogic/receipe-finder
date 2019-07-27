import Search from './models/Search';

/** Global state of the app
 * - Search object
 * - Current receipe object
 * - Shopping list object
 * - Liked receipes
 */
const state = {};

const controlSearch = async () => {
    // Get query from view
    const query = 'pizza'; //TODO

    if(query) {
        // Create new search object and add it to state
        state.search = new Search(query);

        // Prepare UI for results

        // Search for recepies
        await state.search.getResults();

        // Render results on UI
        console.log(state.search.result);
    }
}

document.querySelector('.search').addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});