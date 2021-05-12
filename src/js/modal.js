import { async } from 'regenerator-runtime';
import { API_KEY, API_URL, RES_PER_PAGE } from './config.js';
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  bookmark: [],
  search: { query: '', results: [], page: 1, resultPerPage: RES_PER_PAGE },
};

createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    cookingTime: recipe.cooking_time,
    servings: recipe.servings,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);
    const { recipe } = data.data;
    state.recipe = createRecipeObject(data);
    if (state.bookmark.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (err) {
    throw err;
  }
};
export const searchResults = async function (query) {
  try {
    state.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    // set page no. back to 1
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

export const getSearchResultPage = function (page = 1) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultPerPage;
  const end = page * state.search.resultPerPage;
  return state.search.results.slice(start, end);
};

export const changeServings = function (newServing) {
  state.recipe.ingredients.forEach(ing => {
    // console.log(ing.quantity,newServing,ing.servings);
    ing.quantity = ing.quantity * (newServing / state.recipe.servings);
  });
  state.recipe.servings = newServing;
};

export const addBookmark = function (recipe) {
  //Adding to bookmark array
  state.bookmark.push(recipe);
  // setting the bookmark property
  if (recipe.id === state.recipe.id) recipe.bookmarked = true;
  setLocalStorage();
};

export const deleteBookmark = function (id) {
  const index = state.bookmark.findIndex(el => el.id === id);
  state.bookmark.splice(index, 1);
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  setLocalStorage();
};

export const setLocalStorage = function () {
  localStorage.setItem('bookmark', JSON.stringify(state.bookmark));
};
export const gettLocalStorage = function () {
  const data = JSON.parse(localStorage.getItem('bookmark'));
  if (data) {
    data.forEach(El => {
      addBookmark(El);
    });
  }
};

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format..please specify the correct format....'
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: +quantity ? quantity : '', unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients: ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
