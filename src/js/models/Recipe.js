import axios from 'axios';
import {
  key,
  key2,
  proxy
} from '../config';

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const res = await axios(`${proxy}https://www.food2fork.com/api/get?key=${key2}&rId=${this.id}`);
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;

    } catch (error) {
      console.log(error);
    }
  }
  calcTime() {
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time = periods * 15;
  }
  calcServings() {
    this.servings = 4;
  }

  parseIngedients() {
    const unitsLong = ['tablespoons', 'tablespoon', 'ounce', 'ounces', 'teaspoon', 'cups', 'pounds'];
    const unitShort = ['tbsp', 'tbsp', 'oz', 'oz', 'cup', 'pound'];
    const newIngredients = this.ingredients.map(el => {
      // 1.) Uniform units
      let ingredient = el.toLowerCase();
      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitShort[i]);
      });
      // 2 ) remove parentheses

      ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");

      // Parse ingredients into count, unit and ingredients
      const arrIng = ingredient.split(' ');
      const unitIndex = arrIng.findIndex(el2 => unitShort.includes(el2));

      let objIng;
      if (unitIndex > -1) {
        //there is a unit
        const arrCount = arrIng.slice(0, unitIndex);
        let count;
        if (arrCount.length === 1) {
          count = eval(arrIng[0].replace('-', '+'));
        } else {
          count = eval(arrIng.slice(0, unitIndex).join('+'));
        }
        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(' ')
        };
      } else if (parseInt(arrIng[0], 10)) {
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: '',
          ingredient: arrIng.slice(1).join(' ')
        }
        // there is NO unit but 1st number is number
      } else if (unitIndex === -1) {
        // no unit and no number in 1st position
        objIng = {
          count: 1,
          unit: '',
          // es ingredient : ingredient
          ingredient
        }
      }
      return objIng;
    });
    this.ingredients = newIngredients;
  }
}