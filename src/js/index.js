import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';

import {
  elements,
  renderLoader,
  clearLoader
} from './views/base';
/**  Global state of the app
 *- Search object
 *- Current recipe object
 *- Shopping list object
 *- Linked recipes
 */
const state = {};




/** 
 * SEARCH CONTROLLER
 * 
 */
const controlSearch = async () => {
  // 1) get query from view
  const query = searchView.getInput();
  if (query) {
    // 2) New search object and add to state
    state.search = new Search(query);
    // 3) Preperate UI for results
    searchView.clearInput();
    searchView.clearResults();
    console.log('before try');
    renderLoader(elements.searchRes);

    // 4) Search for recipes
    try {
      await state.search.getResults();
      
      clearLoader();
      searchView.renderResults(state.search.result);
    } catch(err) {
      alert('Error!')
      clearLoader();
    }


  }
}


elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});

elements.searchForm.addEventListener('load', e => {
  e.preventDefault();
  controlSearch();
});



elements.searchResPages.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline');
  if (btn) {
    searchView.clearResults();
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.renderResults(state.search.result, goToPage);
  }
});



/** 
 * RECIPE CONTROLLER
 * 
 */

const controlRecipe = async () => {
  // get id from url
  const id = window.location.hash.replace('#', '');

  if (id) {
    // Prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);
    if(state.search) recipeView.highlightSelected(id);
    // Create new recipe object
    state.recipe = new Recipe(id);
    // Get recipe data
    try {
      await state.recipe.getRecipe();
      state.recipe.calcTime();
      state.recipe.calcServings();
      state.recipe.parseIngedients();
    
      clearLoader();
      recipeView.renderRecipe(state.recipe);
     
    } catch(err) {
      console.log(err);
      alert('Sorry, something go wrong');
    }

  }

};
// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

elements.recipe.addEventListener('click', e=> {
  if(e.target.matches('.btn-decrease, .btn-decrease *')) {
    // Decrease button in lcicked
    console.log(state.recipe.serving);
    if(state.recipe.servings > 1 ) {
      state.recipe.updateServings('dec');
   
      recipeView.updateServingsIngredients(state.recipe);
    }
    
  } else if(e.target.matches('.btn-increase, .btn-increase *'))  {
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  }

})
// Handling recipe button clicks
