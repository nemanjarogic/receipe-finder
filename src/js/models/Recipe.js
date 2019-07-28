import axios from 'axios';
import { key } from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        const res = await axios(`https://www.food2fork.com/api/get?key=xx${key}&rId=${this.id}`);

        this.title = res.data.recipe.title;
        this.author = res.data.recipe.publisher;
        this.img = res.data.recipe.image_url;
        this.url = res.data.recipe.source_url;
        this.ingredients = res.data.recipe.ingredients;
    }

    calculatePreparingTime() {
        // Assuming that we need 15 minutes for each 3 ingredients
        const ingredientsNumber = this.ingredients.length;
        const periods = Math.ceil(ingredientsNumber / 3);

        this.preparingTime = periods * 15;
    }

    calculateServings() {
        this.servings = 4;
    }
}