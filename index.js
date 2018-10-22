/* import string from './models/Search';
//import {add, multiply as mu} from './views/searchView';
import * as searchView from './views/searchView';
console.log(string);
//console.log(add(2,3),mu(2,4));
console.log(searchView.add(2,3));
*/
//5b984225485c0d676be971e25d019556
//https://www.food2fork.com/api/search

import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import Likes from "./models/Likes";
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import {elements, renderLoader, clearLoader} from "./views/base";
/*
Global state of the app
.search object
.current recepies
.shoping list object
.liked recepies
*/
const state = {};
window.state = state;


const controlSearch = async () => {
  //1.Get query from view
  const query = searchView.getInput();

  if (query){
    state.search = new Search(query);
    // Showing loading spinner

    //prep
    searchView.clearInput();
    searchView.clearResults();

    renderLoader(elements.searchRes);

          try{
              // Search recepies
               await state.search.getResult();

              // render results
              clearLoader();
              searchView.renderResult(state.search.result);
            }
          catch(err) {
            alert(`${err}, Search fail`);
            clearLoader();
          };



}};

elements.searchForm.addEventListener('submit', e => {
e.preventDefault();
controlSearch();

});

elements.searchResPages.addEventListener('click', e => {
const btn = e.target.closest('.btn-inline');
if (btn) {
  const goToPage = parseInt(btn.dataset.goto,10);
  searchView.clearResults();
  searchView.renderResult(state.search.result , goToPage);
    }});

/*RECIPE CONTROLLER*/
const controlRecipe =async () =>{
//get the id
const id =window.location.hash.replace('#','');
console.log(id);
if (id) {
  //change ui
  recipeView.clearRecipe();
  renderLoader(elements.recipe);

  //highlight selected item
  if (state.search) {
    searchView.highlightSelected(id);
  }


  // creat recepie object
  state.recipe = new Recipe(id);
  try{

  // get dataset
  await state.recipe.getRecipe();
  state.recipe.parseIngredients();
  // calc servings
  state.recipe.calcTime();
  state.recipe.calcServing();


  // render recipes
  clearLoader();
  recipeView.renderRecepie(state.recipe , state.likes.isLiked(id));
    }catch(err){
        alert(err);
      };

}
};

//test

//Likes CONTROLLER
const controlLike = () =>{
if (!state.likes) {
  state.likes= new Likes();
}
const currentID = state.recipe.id;
console.log(currentID);
if (!state.likes.isLiked(currentID)) {
  //add liked
  const newLike = state.likes.addLike(currentID,state.recipe.title,state.recipe.author,state.recipe.img);


  //toggle the like recipe__btn
  likesView.toggleLikeBtn(true);


  // add like to UI
  likesView.renderLike(newLike);
  console.log(state.likes);

}else {
  //remove liked
  state.likes.deleteLike(currentID);

  //toggle the like recipe__btn

  likesView.toggleLikeBtn(false);


  // remove like to UI
  console.log(state.likes);
  likesView.deleteLike(currentID);


}






likesView.toggleLikeMenu(state.likes.getNumLikes());
};


// LIST CONTROLLER

const controlList = () =>{

if (!state.list) {
  state.list = new List();

}

state.recipe.ingredients.forEach(el =>
{
  const item = state.list.addItems(el.count, el.unit, el.ingredient);
  listView.renderItem(item);
  console.log(state.list);
})








};


elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
  //handle deletItem
  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
    state.list.deletItem(id);

    listView.deleteItem(id);

  }else if (e.target.matches(".shopping__count--value")) {
    const val = parseFloat(e.target.value);
    state.list.updateCount(id,val);

  }

});


// deletItemAll

elements.deletall.addEventListener('click', e =>{
e.preventDefault();
state.list.deletItemAll();
listView.deletallItem();
console.log(state.list);

});

window.addEventListener('load', () => {
  state.likes= new Likes();

  state.likes.readStorage();

  likesView.toggleLikeMenu(state.likes.getNumLikes());

  state.likes.likes.forEach(like => likesView.renderLike(like));


});

//window.addEventListener('hashchange', controlRecipe);
//window.addEventListener('load', controlRecipe);

['hashchange','load'].forEach(event => window.addEventListener(event,controlRecipe));


elements.recipe.addEventListener('click', function (e) {
  if (e.target.matches('.btn-decrease,.btn-decrease *')) {
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);

    }else {
      alert('You can not decrease servings under 1!')
    }

  }else if (e.target.matches('.btn-increase,.btn-increase *')) {
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);

  }else if (e.target.matches('.recipe__btn--add,.recipe__btn--add *')) {

    controlList();

  }
  else if (e.target.matches('.recipe__love, .recipe__love *')) {
    //Like CONTROLLER
    controlLike();
  }
console.log(state.recipe);
});

window.l = new List();
