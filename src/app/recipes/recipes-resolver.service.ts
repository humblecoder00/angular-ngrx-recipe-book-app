import { Injectable } from '@angular/core'
import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot,
} from '@angular/router'
import { Store } from '@ngrx/store'
import { Actions, ofType } from '@ngrx/effects'
import { of } from 'rxjs'
import { map, switchMap, take } from 'rxjs/operators'

import { Recipe } from './recipe.model'

import * as fromApp from '../store/app.reducer'
import * as RecipesActions from '../recipes/store/recipe.actions'

@Injectable({ providedIn: 'root' })
export class RecipesResolverService implements Resolve<Recipe[]> {
    constructor(
        private store: Store<fromApp.AppState>,
        private actions$: Actions
    ) {}

    /*
	Used for edge case example.
	If we visit a route, for example /recipes/2 and haven't fetched any data, app will crash
	So for that case we'll call the api to fetch the data by using the resolver - so data can be there
	We trigger this only if there is no recipes present, otherwise we get a bug with edit.
	Because it fires everytime before we visit the route, hence sends the request everytime as well.
    */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.store.select('recipes').pipe(
            take(1), // just do it once
            map((recipesState) => {
                return recipesState.recipes
            }),
            // make sure to not re-fetch data on edit, if it already exists
            switchMap((recipes) => {
                if (recipes.length === 0) {
                    this.store.dispatch(new RecipesActions.FetchRecipes())
                    return this.actions$.pipe(
                        ofType(RecipesActions.SET_RECIPES), // trigger when recipes set, so it is the right time
                        take(1)
                    )
                } else {
                    return of(recipes)
                }
            })
        )
    }
}
