import View from './view';

class NewRecipe extends View {
  _parentElement = document.querySelector('.upload');
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  _message = 'Recipe was uploaded successfully!!';
  constructor() {
    super();
    this._addHandlerEvents();
  }
  Model() {
    this._window.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }
  _addHandlerEvents() {
    this._btnOpen.addEventListener('click', this.Model.bind(this));
    this._btnClose.addEventListener('click', this.Model.bind(this));
    this._overlay.addEventListener('click', this.Model.bind(this));
  }
  addHandlerNewRecipe(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const data = Object.fromEntries([...new FormData(this)]);
      handler(data);
    });
  }
}

export default new NewRecipe();
