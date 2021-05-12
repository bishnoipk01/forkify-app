import View from './view';
import icons from 'url:../../img/icons.svg'; // parcel 2

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultPerPage
    );
    // case- we are on first page and there are other pages
    if (curPage === 1 && numPages > 1) {
      return `<button data-goto =${
        curPage + 1
      } class="btn--inline pagination__btn--next">
        <span>${curPage + 1}</span>
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
        </svg>
        </button>`;
    }
    // case- last page
    if (curPage === numPages && numPages > 1) {
      return `<button data-goto =${
        curPage - 1
      } class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>${curPage - 1}</span>
        </button>`;
    }
    // case- somewhere in-between
    if (curPage < numPages) {
      return (
        `<button data-goto =${
          curPage - 1
        } class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>${curPage - 1}</span>
        </button>` +
        `<button data-goto =${
          curPage + 1
        } class="btn--inline pagination__btn--next">
        <span>${curPage + 1}</span>
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
        </svg>
        </button>`
      );
    }
    // case- we are on first page and there are NO other pages
    return ``;
  }
  addHandlerPagination(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      const gotoPage = +btn.dataset.goto;
      if (!btn) return;
      handler(gotoPage);
    });
  }
}

export default new PaginationView();
