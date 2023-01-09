import { Ingredient } from 'src/app/shared/ingredient.model'
import * as ShoppingListActions from './shopping-list.actions'

export interface State {
    ingredients: Ingredient[]
    editedIngredient: Ingredient
    editedIngredientIndex: number
}

const initialState: State = {
    ingredients: [new Ingredient('Apples', 5), new Ingredient('Tomatoes', 10)],
    editedIngredient: null,
    editedIngredientIndex: -1, // to pass invalid idx as default value
}

// State changes are always IMMUTABLE!
export function shoppingListReducer(
    state = initialState,
    action: ShoppingListActions.ShoppingListActions
) {
    switch (action.type) {
        case ShoppingListActions.ADD_INGREDIENT:
            return {
                ...state,
                ingredients: [...state.ingredients, action.payload],
            }

        case ShoppingListActions.ADD_INGREDIENTS:
            return {
                ...state,
                ingredients: [...state.ingredients, ...action.payload],
            }

        case ShoppingListActions.UPDATE_INGREDIENT:
            // get the target ingredient
            const ingredient = state.ingredients[state.editedIngredientIndex]

            // here we override everything, no need to specify a key:
            const updatedIngredient = {
                ...ingredient,
                ...action.payload,
            }

            const updatedIngredients = [...state.ingredients]
            updatedIngredients[state.editedIngredientIndex] = updatedIngredient

            return {
                ...state,
                ingredients: updatedIngredients,
                // update also stops the edit process (default edit mode values)
                editedIngredientIndex: -1,
                editedIngredient: null,
            }

        case ShoppingListActions.DELETE_INGREDIENT:
            return {
                ...state,
                ingredients: state.ingredients.filter((ing, idx) => {
                    return idx !== state.editedIngredientIndex
                }),
                // delete also stops the edit process (default edit mode values)
                editedIngredientIndex: -1,
                editedIngredient: null,
            }

        case ShoppingListActions.START_EDIT:
            return {
                ...state,
                editedIngredient: { ...state.ingredients[action.payload] }, // recieves an index from payload
                editedIngredientIndex: action.payload,
            }

        // simply revert editedIngredient and it's index to default:
        case ShoppingListActions.STOP_EDIT:
            return {
                ...state,
                editedIngredient: null,
                editedIngredientIndex: -1,
            }

        default:
            return state
    }
}
