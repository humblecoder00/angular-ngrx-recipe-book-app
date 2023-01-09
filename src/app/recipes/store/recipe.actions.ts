import { Action } from '@ngrx/store'
import { Recipe } from '../recipe.model'

export const SET_RECIPES = '[Recipes] SET_RECIPES'
export const FETCH_RECIPES = '[Recipes] FETCH_RECIPES'
export const ADD_RECIPE = '[Recipes] ADD_RECIPE'
export const UPDATE_RECIPE = '[Recipes] UPDATE_RECIPE'
export const DELETE_RECIPE = '[Recipes] DELETE_RECIPE'
export const STORE_RECIPES = '[Recipes] STORE_RECIPES'

export class SetRecipes implements Action {
    readonly type = SET_RECIPES

    constructor(public payload: Recipe[]) {}
}

// no constructor, simply used in effect (listener)
// This is used for HTTP request - GET
export class FetchRecipes implements Action {
    readonly type = FETCH_RECIPES
}

export class AddRecipe implements Action {
    readonly type = ADD_RECIPE

    constructor(public payload: Recipe) {}
}

export class UpdateRecipe implements Action {
    readonly type = UPDATE_RECIPE

    constructor(public payload: { index: number; recipe: Recipe }) {}
}

export class DeleteRecipe implements Action {
    readonly type = DELETE_RECIPE

    constructor(public payload: number) {}
}

// no constructor, simply used in effect (listener), since recipes are already at the store at this point.
// This is used for HTTP request - PUT
export class StoreRecipes implements Action {
    readonly type = STORE_RECIPES
}

export type RecipesActions =
    | SetRecipes
    | FetchRecipes
    | AddRecipe
    | UpdateRecipe
    | DeleteRecipe
    | StoreRecipes
