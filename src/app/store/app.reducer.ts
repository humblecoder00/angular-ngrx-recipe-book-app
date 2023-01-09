// merge all reducers together here

import { ActionReducerMap } from '@ngrx/store'

import * as fromAuth from '../auth/store/auth.reducer'
import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer'

export interface AppState {
    auth: fromAuth.State
    shoppingList: fromShoppingList.State
}

export const appReducer: ActionReducerMap<AppState> = {
    auth: fromAuth.authReducer,
    shoppingList: fromShoppingList.shoppingListReducer,
}
