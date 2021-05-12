import * as modal from './modal.js';
import viewRecipe from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultsView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import NewRecipe from './views/addNewRecipe.js';
import { TIMEOUT_CLOSE_FORM } from './config.js';

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    viewRecipe.renderSpinner();
    // 0) mark selected recipe
    resultView.update(modal.getSearchResultPage());
    // 1. load recipe
    await modal.loadRecipe(id);
    // 2. render recipe on UI
    viewRecipe.render(modal.state.recipe);
  } catch (err) {
    viewRecipe.renderError();
  }
};

const controlSearch = async function () {
  try {
    //  getting search Query
    const query = searchView.getQuery();
    // gaurd clause
    if (!query) return;
    // waiting for search result
    resultView.renderSpinner();
    await modal.searchResults(query);
    // resultsView.render(modal.state.search.results);
    resultsView.render(modal.getSearchResultPage());
    // render pagination
    paginationView.render(modal.state.search);
  } catch (err) {
    console.error(err);
  }
};
controlSearch();
const controlPagination = function (gotoPage) {
  // render new pages
  resultsView.render(modal.getSearchResultPage(gotoPage));
  // render new pagination
  paginationView.render(modal.state.search);
};
const controlServings = function (newServing) {
  // set new servings
  modal.changeServings(newServing);
  // update the recipe view
  viewRecipe.update(modal.state.recipe);
};
const controlBookmark = function () {
  if (!modal.state.recipe.bookmarked) modal.addBookmark(modal.state.recipe);
  else modal.deleteBookmark(modal.state.recipe.id);
  viewRecipe.update(modal.state.recipe);
  bookmarkView.render(modal.state.bookmark);
};
const controlNewRecipe = async function (data) {
  try {
    // render spinner
    NewRecipe.renderSpinner();
    // uploading the recipe
    await modal.uploadRecipe(data);
    // render the recipe on view
    viewRecipe.render(modal.state.recipe);
    // display success message
    NewRecipe.renderMessage();
    // render bookmark view
    bookmarkView.render(modal.state.bookmark);
    // Update hash of URL
    window.history.pushState(null, '', `#${modal.state.recipe.id}`);
    // close the form
    setTimeout(() => NewRecipe.Model(), TIMEOUT_CLOSE_FORM);
  } catch (err) {
    NewRecipe.renderError(err.message);
  }
};
const init = function () {
  viewRecipe.renderEventHandler(controlRecipes);
  searchView.addHandlerSearch(controlSearch);
  paginationView.addHandlerPagination(controlPagination);
  viewRecipe.addHandlerServings(controlServings);
  viewRecipe.addHandlerBookmark(controlBookmark);
  NewRecipe.addHandlerNewRecipe(controlNewRecipe);
  // get data from Local storage
  modal.gettLocalStorage();
  bookmarkView.render(modal.state.bookmark);
};
init();
