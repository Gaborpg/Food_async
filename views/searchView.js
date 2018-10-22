/*export const add = (a,b) => a+b;
export const multiply = (a,b) =>a*b;
*/
import {elements} from "./base";


export const getInput = () => elements.searchInput.value;

export const clearInput =  () => {elements.searchInput.value=""};

export const clearResults = () =>{
  elements.searchResultList.innerHTML = "";
  elements.searchResPages.innerHTML = "";
};

export const highlightSelected= id =>{
  const resultArr = Array.from(document.querySelectorAll('.results__link'));
  resultArr.forEach(el => {el.classList.remove('results__link--active')});

document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');

};



//Title Limit


export const limitRecipeTitle = (title, limit = 17) =>
{
  const newTitle = [];
if( title.length >limit){
  title.split(' ').reduce((acc, cur) => {
    if (acc + cur.length <= limit){
      newTitle.push(cur);

    }
    return acc+ cur.length;


  }, 0);
  return `${newTitle.join(' ')}...`;
}
return title;
}


// Add Recepies
const renderRecepies = recipe => {
  const markup = `
                  <li>
                      <a class="results__link results__link--active" href="#${recipe.recipe_id}">
                          <figure class="results__fig">
                              <img src="${recipe.image_url}" alt="${limitRecipeTitle(recipe.title)}">
                          </figure>
                          <div class="results__data">
                              <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                              <p class="results__author">${recipe.publisher}</p>
                          </div>
                      </a>
                  </li>
`;

elements.searchResultList.insertAdjacentHTML('beforeend',markup);


};
const createButton = (page,type) =>`
 <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page-1 : page + 1}>
      <svg class="search__icon">
          <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
      </svg>
      <span>Page ${type === 'prev' ? page-1 : page + 1}</span>
  </button>`;


const renderButtons = (page,numResult,resPerPage) =>{
const pages = Math.ceil(numResult / resPerPage);
let button;
if (page === 1 && pages >1)
                  {
                    button = createButton(page,'next');
                   }else if (page < pages) {
                      button =`${createButton(page,'prev')}
                               ${createButton(page,'next')}` ;
                            }else if (page === pages && pages >1) {
                                        button = createButton(page,'prev');
                                      }
  elements.searchResPages.insertAdjacentHTML('afterbegin',button);


};
export const renderResult = (recepies, page = 1, resPerPage=10) =>{
  const start = (page- 1)*resPerPage;
  const end =   page * resPerPage;

  recepies.slice(start,end).forEach(renderRecepies);
  renderButtons(page, recepies.length ,resPerPage);

};
