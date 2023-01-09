import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Actions, Effect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { switchMap, map, withLatestFrom } from 'rxjs/operators'

import * as fromApp from '../../store/app.reducer'

import { environment } from '../../../environments/environment'
import { Recipe } from '../recipe.model'
const { API_URL } = environment

import * as RecipesActions from './recipe.actions'

@Injectable()
export class RecipeEffects {
    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private store: Store<fromApp.AppState>
    ) {}

    @Effect()
    fetchRecipes = this.actions$.pipe(
        ofType(RecipesActions.FETCH_RECIPES),
        switchMap(() => {
            return this.http.get<Recipe[]>(`${API_URL}/recipes.json`)
        }),
        // now since we are in a pipe method, we just add the second Observable methods after the exhaustMap
        map((recipes) => {
            return recipes.map((recipe) => {
                return {
                    ...recipe,
                    ingredients: recipe.ingredients ? recipe.ingredients : [],
                }
            })
        }),
        map((recipes) => {
            return new RecipesActions.SetRecipes(recipes)
        })
    )

    @Effect({ dispatch: false })
    storeRecipes = this.actions$.pipe(
        ofType(RecipesActions.STORE_RECIPES),
        // to access the store in the Observable, we use withLatestForm() operator.
        // withLatestForm() allows us to merge a value from another Observable into this Observable here
        withLatestFrom(this.store.select('recipes')),
        // actionData - is coming from ofType, recipesState - is coming from "withLatestForm()" above
        // RxJS also gives us the array destructuring
        switchMap(([actionData, recipesState]) => {
            return this.http.put(
                `${API_URL}/recipes.json`,
                recipesState.recipes
            )
        })
    )
}
