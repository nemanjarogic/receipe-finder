import Search from './models/Search';
import Recipe from './models/Recipe';
import ShoppingList from './models/ShoppingList';
import LikedRecipes from './models/LikedRecipes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as shoppingListView from './views/shoppingListView';
import { elements, elementStrings, renderLoader, clearLoader } from './views/base';


/** Global state of the app
 * - Search object
 * - Current receipe object
 * - Shopping list object
 * - Liked receipes
 */
const state = {};

/**-------------------------------------------------------------------
 * SEARCH CONTROLLER
 -------------------------------------------------------------------*/
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

/**-------------------------------------------------------------------
 * RECIPE CONTROLLER
 -------------------------------------------------------------------*/
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

/**-------------------------------------------------------------------
 * SHOPPING LIST CONTROLLER
 -------------------------------------------------------------------*/
const controlShoppingList = () => {

    if(!state.shoppingList) {
        state.shoppingList = new ShoppingList();
    }

    // Add each ingredient to the list
    state.recipe.ingredients.forEach(el => {
        const item = state.shoppingList.addItem(el.count, el.unit, el.ingredient);
        shoppingListView.renderItem(item);
    });

}

elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    if(e.target.matches('.shopping__delete, .shopping__delete *')) {
        state.shoppingList.deleteItem(id);
        shoppingListView.deleteItem(id);
    } else if(e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.shoppingList.updateCount(id, val);
    }
});

/**-------------------------------------------------------------------
 * LIKED RECIPE CONTROLLER
 -------------------------------------------------------------------*/

 const controlRecipeLike = () => {
     
    if(!state.likedRecipes) {
        state.likedRecipes = new LikedRecipes();
    }

    const recipeID = state.recipe.id;

    if(!state.likedRecipes.isRecipeLiked(recipeID)) {
        const newLike = state.likedRecipes.addRecipe(
            recipeID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img,
        );

        console.log(state.likedRecipes);
    } else {
        state.likedRecipes.deleteRecipe(recipeID);
        console.log(state.likedRecipes);
    }
 }

//-------------------------------------------------------------------
// Handling recipe button clicks
// -------------------------------------------------------------------
elements.recipe.addEventListener('click', e => {

    // If button with class btn-decrease or any of its child is clicked
    if(e.target.matches('.btn-decrease, .btn-decrease *')) {
        if(state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if(e.target.matches('.btn-increase, .btn-increase *')) {
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        controlShoppingList();
    } else if(e.target.matches('.recipe__love, .recipe__love *')) {
        controlRecipeLike();
    }
});