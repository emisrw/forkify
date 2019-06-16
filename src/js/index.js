import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
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



/** 
 * LIST CONTROLLER
 * 
 */

 const controlList = () => {
   // Create a new list IF there is none yet
   if(!state.list) state.list = new List();

   // Add each ingredient to the list
   state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
   });
 };

// Handle delete and update list events
elements.shopping.addEventListener('click', e=> {
  const id = e.target.closest('.shopping__item').dataset.itemid;
  // handle delete button
  if(e.target.matches('.shopping__delete, .shopping__delete *')) {
    // delete from state
     state.list.deleteItem(id);
    // delete from UI
    console.log('item id ' + id);
     listView.deleteItem(id);
  }
});


elements.recipe.addEventListener('click', e=> {
  if(e.target.matches('.btn-decrease, .btn-decrease *')) {

    if(state.recipe.servings > 1 ) {
      state.recipe.updateServings('dec');
   
      recipeView.updateServingsIngredients(state.recipe);
    }
    
  } else if(e.target.matches('.btn-increase, .btn-increase *'))  {
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  } else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    controlList();
  }
  
});
// Handling recipe button clicks

