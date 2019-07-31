import { elements, elementStrings } from './base';


export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
}

export const clearResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
}

export const renderResults = (recipes, page = 1, resultsPerPage = 10) => {
    const startIndex = (page - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;

    // Render recipes of current page
    recipes.slice(startIndex, endIndex).forEach(renderRecipe);

    // Render page pagination
    renderPageButtons(page,  recipes.length, resultsPerPage);
}

export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    });

    document.querySelector(`.results__link[href*='${id}']`).classList.add('results__link--active');
}

export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];

    if(title.length > limit) {
        title.split(' ').reduce((acc, curr) => {
            if(acc + curr.length <= limit) {
                newTitle.push(curr)
            }

            return acc + curr.length;
        }, 0);

        return `${newTitle.join(' ')} ...`;
    }

    return title;
}

const renderRecipe = recipe => {
    const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="Test">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;

    elements.searchResList.insertAdjacentHTML('beforeend', markup);
}

const renderPageButtons = (page, totalResultsNumber, resultsPerPage) => {
    const totalPages = Math.ceil(totalResultsNumber / resultsPerPage);
    let pageButton;

    if(page === 1 && totalPages > 1) {
        pageButton = createPageButton(page, 'next');
    } else if(page < totalPages) {
        pageButton = `
            ${createPageButton(page, 'prev')}
            ${createPageButton(page, 'next')}
        `;
    } else if(page === totalPages && totalPages > 1) {
        pageButton = createPageButton(page, 'prev');
    }

    elements.searchResPages.insertAdjacentHTML('afterbegin', pageButton);
}

const createPageButton = (page, type) => `
    <button class="${elementStrings.btnInline} results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;