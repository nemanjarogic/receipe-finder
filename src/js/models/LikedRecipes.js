export default class LikedRecipes {
    constructor() {
        this.likedRecipes = [];
    }

    addRecipe(id, title, author, img) {
        const recipe = { id, title, author, img };
        this.likedRecipes.push(recipe);

        this.persistData();

        return recipe;
    }

    deleteRecipe(id) {
        const index = this.likedRecipes.findIndex(el => el.id === id);
        this.likedRecipes.splice(index, 1);

        this.persistData();
    }

    isRecipeLiked(id) {
        return this.likedRecipes.findIndex(el => el.id === id) !== -1;
    }

    getNumberOfLikedRecipes() {
        return this.likedRecipes.length;
    }

    persistData() {
        localStorage.setItem('likedRecipes', JSON.stringify(this.likedRecipes));
    }

    readDataFromStorage() {
        const storage = JSON.parse(localStorage.getItem('likedRecipes'));
        if(storage) {
            // Restore liked recipes from localStorage
            this.likedRecipes = storage;
        }
    }
};