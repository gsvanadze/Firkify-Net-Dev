import Recipe from "./models/Recipe";
import Search from "./models/search";
import List from "./models/List";
import Like from "./models/Like";
import { clearLoader, elements, renderLoader } from "./view/base";
import * as searchView from "./view/searchView";
import * as recipeView from './view/recipeView';
import * as listView from './view/listView';


const state = {};
window.state = state;

const controlSearch = async () => {

    const query = searchView.getInput();
    if(query){

        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchResList);
        state.search = new Search(query);
        await state.search.getResults()
        clearLoader();
        searchView.renderResult(state.search.result);

    }
    
}


 // Recipe

const controlRecipe = async () => {
    const id = window.location.hash.replace("#", '')

    if(id){

        //prepare UI
        recipeView.clearRecipe();
        renderLoader(elements.Recipe);
        
        state.search && searchView.activeLinkStyle(id);

        // Create new Recipe object
        state.recipe = new Recipe(id);


        try {
            await state.recipe.getRecipe();
        } catch (error) {
            alert('Recipe error')
        }

        state.recipe.parseIngredients();

        // calculate time and searvings

        state.recipe.calcTime();
        state.recipe.calcServings();
        

        clearLoader();
        recipeView.renderRecipe(state.recipe)
    }
}

// shopping list

const controlList = () => {
    if(!state.list) state.list = new List();

    listView.clearShoppingList();

// add each ingredient
    state.recipe.ingredients.forEach(el =>{
        const item = state.list.addItems(el.count, el.unit, el.ingredient)
        listView.renderItem(item);
    })
}

const controlLike = () => {
    state.likes = new Like();

    const currentId = state.recipe.id;
}
//handle delete and update list item events
elements.shopping.addEventListener('click', e=> {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    if(e.target.matches('shopping__delete, .shopping__delete *')){
        state.list.deleteItem(id);
        listView.deleteItem(id);
    }else if(e.target.matches('.shopping__count__input')){
        //update item
        const newValue = +e.target.value;
        state.list.updateItem(id, newValue);
    }

})

elements.searchForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    controlSearch();
})

elements.searchResPages.addEventListener('click', e =>{
    const btn = e.target.closest('.btn-inline');
    if(btn){
        const goToPage = +btn.dataset.goto;
        searchView.clearResults();
        searchView.renderResult(state.search.result, goToPage);
    }

});


window.addEventListener('hashchange', () => {
    controlRecipe();
})

window.addEventListener('load', () =>{
    controlRecipe();
})

elements.Recipe.addEventListener('click', e => {
if(e.target.matches('.btn-decrease, .btn-decrease *')){
    //decrease
    if(state.recipe.servings > 1 ){
        state.recipe.updateServingIngredient('dec');
        recipeView.updateServingIngredient(state.recipe);
    }
    
}else if (e.target.matches('.btn-increase, .btn-increase *')){
    //increase
    state.recipe.updateServingIngredient('inc');
    recipeView.updateServingIngredient(state.recipe);  
}else if(e.target.matches('.recipe__btn__add, .recipe__btn__add *')){
    controlList();
}else if(e.target.matches('.recipe__love, .recipe__love *')){
    // Like controller
    controlLike();


}

})