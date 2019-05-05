import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements } from './views/base';
/**  Global state of the app
 *- Search object
 *- Current recipe object
 *- Shopping list object
 *- Linked recipes
 */
const state = {};

const controlSearch = async () => {
  // 1) get query from view
  const query = searchView.getInput();
  if (query) {
    // 2) New search object and add to state
    state.search = new Search(query);
    // 3) Preperate UI for results
    searchView.clearInput();
    searchView.clearResults();
    // 4) Search for recipes
    await state.search.getResults();
    // 5) render results on UI
    console.log(state.search);
    searchView.renderResults(state.search.result);

  }
}


elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});


const search = new Search('pizza');
search.getResults();