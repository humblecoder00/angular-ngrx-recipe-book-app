import { Action } from "@ngrx/store";
import { Ingredient } from "src/app/shared/ingredient.model";

export const ADD_INGREDIENT = 'ADD_INGREDIENT'
export const ADD_INGREDIENTS = 'ADD_INGREDIENTS'
export const UPDATE_INGREDIENT = 'UPDATE_INGREDIENT'
export const DELETE_INGREDIENT = 'DELETE_INGREDIENT'
export const START_EDIT = 'START_EDIT'
export const STOP_EDIT = 'STOP_EDIT'

export class AddIngredient implements Action {
    // keep it readonly to enhance the type safety
    readonly type = ADD_INGREDIENT

    // typically named "payload" for convention,
    // the "Action" interface only forces you to add a "type" property
    // payload: Ingredient
    constructor(public payload: Ingredient) {}
}

export class AddIngredients implements Action {
    // keep it readonly to enhance the type safety
    readonly type = ADD_INGREDIENTS

    // typically named "payload" for convention,
    // the "Action" interface only forces you to add a "type" property
    // payload: Ingredient
    constructor(public payload: Ingredient[]) {}
}

// we already know the edited index in the state due to the implementation, hence we don't need to pass it here
export class UpdateIngredient implements Action {
    // keep it readonly to enhance the type safety
    readonly type = UPDATE_INGREDIENT

    // typically named "payload" for convention,
    // the "Action" interface only forces you to add a "type" property
    // payload: Ingredient
    constructor(public payload: Ingredient) {}
}

// we already know the edited index in the state due to the implementation, hence we don't need to pass it here
export class DeleteIngredient implements Action {
    // keep it readonly to enhance the type safety
    readonly type = DELETE_INGREDIENT
}

export class StartEdit implements Action {
    // keep it readonly to enhance the type safety
    readonly type = START_EDIT

    // typically named "payload" for convention,
    // the "Action" interface only forces you to add a "type" property
    // payload: Ingredient
    constructor(public payload: number) {}
}

// doesn't need any payload, just to listen
export class StopEdit implements Action {
    // keep it readonly to enhance the type safety
    readonly type = STOP_EDIT
}


// export available action classes as union type:
export type ShoppingListActions = 
    | AddIngredient
    | AddIngredients
    | UpdateIngredient
    | DeleteIngredient
    | StartEdit
    | StopEdit