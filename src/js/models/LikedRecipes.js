export default class LikedRecipes {
    constructor() {
        this.likedRecipes = [];
    }

    addRecipe(id, title, author, img) {
        const recipe = { id, title, author, img };
        this.likedRecipes.push(recipe);

        return recipe;
    }

    deleteRecipe(id) {
        const index = this.likedRecipes.findIndex(el => el.id === id);
        this.likedRecipes.splice(index, 1);
    }

    isRecipeLiked(id) {
        return this.likedRecipes.findIndex(el => el.id === id) !== -1;
    }

    getNumberOfLikedRecipes() {
        return this.likedRecipes.length;
    }
};