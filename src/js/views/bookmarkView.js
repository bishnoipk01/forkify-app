import previewView from './previewView.js';
import View from './view.js';
class BookmarkView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _ErrorMsg = 'No bookmarks yet..find a good recipe and bookmark it ;';
  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new BookmarkView();
