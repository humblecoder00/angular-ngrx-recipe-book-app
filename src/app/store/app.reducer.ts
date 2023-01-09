// merge all reducers together here

import { ActionReducerMap } from '@ngrx/store'

import * as fromAuth from '../auth/store/auth.reducer'
import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer'
import * as fromRecipes from '../recipes/store/recipe.reducer'

export interface AppState {
    auth: fromAuth.State
    shoppingList: fromShoppingList.State
    recipes: fromRecipes.State
}

export const appReducer: ActionReducerMap<AppState> = {
    auth: fromAuth.authReducer,
    shoppingList: fromShoppingList.shoppingListReducer,
    recipes: fromRecipes.recipeReducer,
}
