import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Store } from '@ngrx/store'
import { map, switchMap } from 'rxjs/operators'

import { Recipe } from '../recipe.model'
import * as fromApp from '../../store/app.reducer'
import * as RecipesActions from '../store/recipe.actions'
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions'

@Component({
    selector: 'app-recipe-detail',
    templateUrl: './recipe-detail.component.html',
    styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit {
    recipe: Recipe
    id: number

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private store: Store<fromApp.AppState>
    ) {}

    ngOnInit() {
        // subscribe to route change
        // NOTE: Route Observables does not need cleanup since Angular handles it, but your own custom Observables do!

        this.route.params
            .pipe(
                map((params) => {
                    return +params['id']
                }),
                switchMap((id) => {
                    this.id = id
                    return this.store.select('recipes')
                }),
                map((recipesState) => {
                    return recipesState.recipes.find((recipe, idx) => {
                        return idx === this.id
                    })
                })
            )
            .subscribe((recipe) => {
                this.recipe = recipe
            })

        // OR:
        // this.route.params.subscribe((params: Params) => {
        //     this.id = +params['id']
        //     this.store
        //         .select('recipes')
        //         .pipe(
        //             map((recipesState) => {
        //                 return recipesState.recipes.find((recipe, idx) => {
        //                     return idx === this.id
        //                 })
        //             })
        //         )
        //         .subscribe((recipe) => {
        //             this.recipe = recipe
        //         })
        // })
    }

    onAddToShoppingList() {
        this.store.dispatch(
            new ShoppingListActions.AddIngredients(this.recipe.ingredients)
        )
    }

    onEditRecipe() {
        this.router.navigate(['edit'], { relativeTo: this.route })
        // a bit more complex version:
        // this.router.navigate(['../', this.id, 'edit'], { relativeTo: this.route })
    }

    onDeleteRecipe() {
        this.store.dispatch(new RecipesActions.DeleteRecipe(this.id))
        // navigate:
        this.router.navigate(['/recipes'])
    }
}
