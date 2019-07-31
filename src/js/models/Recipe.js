import axios from 'axios';
import { key } from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        const res = await axios(`https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);

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

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];

        const newIngredients = this.ingredients.map(el => {

            // Uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            // Remove text between parentheses (details that we actually don't need)
            // For example: 2 (10 inch) tortilla
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // Parse ingredients into count, unit and ingredient
            const arrIngredient = ingredient.split(' ');
            const unitIndex = arrIngredient.findIndex(el2 => units.includes(el2));

            let  objIngredient;

            if(unitIndex > -1) {
                // There is unit
                // For example: 2 1/2 cup mozzarella or 4 cups or 1-1/2 cup (which really means 1.5)
                // arrCount can be [2, 1/2] or [4]

                const arrCount = arrIngredient.slice(0, unitIndex);
                
                let count;
                if(arrCount.length === 1) {
                    count = eval(arrIngredient[0].replace('-', '+'));
                } else {
                    // ('4+1/2') -> 4.5
                    // We can have next ingredient (skip string at the beggining): "scant 1 cup of unbleached all-purpose flour"
                    const countItems = arrIngredient.slice(0, unitIndex).map(countItem => {
                        const value = parseFloat(countItem);
                        return isNaN(value) ? 0 : value;
                    });
                    count = countItems.reduce((a, b) => a + b, 0);
                }

                objIngredient = {
                    count,
                    unit: arrIngredient[unitIndex],
                    ingredient: arrIngredient.slice(unitIndex + 1).join(' ')
                };

            } else if (parseInt(arrIngredient[0], 10)) {
                // There is no unit
                // For  example: 16 slices pepperoni
                objIngredient = {
                    count: parseInt(arrIngredient[0], 10),
                    unit: '',
                    ingredient: arrIngredient.slice(1).join(' ') 
                };
            } else if(unitIndex === -1) {
                // There is no unit and no number in 1st position
                // For example: Kiwi Fruit
                objIngredient = {
                    count: 1,
                    unit: '',
                    ingredient
                };
            }

            return objIngredient;
        });

        this.ingredients = newIngredients;
    }

    updateServings(type) {
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        });

        this.servings = newServings;
    }
}