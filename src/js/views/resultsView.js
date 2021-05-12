import previewView from './previewView.js';
import View from './view.js';
class ResultView extends View {
  _parentElement = document.querySelector('.results');
  _ErrorMsg = 'No recipe found for this query..search again';
  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultView();
