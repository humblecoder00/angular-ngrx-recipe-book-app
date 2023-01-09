import { Recipe } from '../recipe.model'
import * as RecipesActions from './recipe.actions'

export interface State {
    recipes: Recipe[]
}

const initalState: State = {
    recipes: [],
}

export function recipeReducer(
    state = initalState,
    action: RecipesActions.RecipesActions
) {
    switch (action.type) {
        case RecipesActions.SET_RECIPES:
            return {
                ...state,
                recipes: [...action.payload],
            }
        case RecipesActions.ADD_RECIPE:
            return {
                ...state,
                recipes: [...state.recipes, action.payload],
            }
        case RecipesActions.UPDATE_RECIPE:
            // get the target recipe & update it with new one:
            const updatedRecipe = {
                ...state.recipes[action.payload.index],
                ...action.payload.recipe,
            }

            const updatedRecipes = [...state.recipes]
            updatedRecipes[action.payload.index] = updatedRecipe

            return {
                ...state,
                recipes: updatedRecipes,
            }
        case RecipesActions.DELETE_RECIPE:
            return {
                ...state,
                recipes: state.recipes.filter((recipe, idx) => {
                    return idx !== action.payload
                }),
            }
        default:
            return state
    }
}
