import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, tap } from 'rxjs/operators'

import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from "../recipes/recipe.model";

import { environment } from '../../environments/environment'
const { API_URL} = environment

@Injectable({ providedIn: 'root' })
export class DataStorageService {
    constructor(
        private http: HttpClient,
        private recipeService: RecipeService,
    ) {}

    storeRecipes() {
        const recipes = this.recipeService.getRecipes()
        this.http.put(`${API_URL}/recipes.json`, recipes)
            .subscribe(response => {
                console.log('RESPONSE HERE:', response)
            })
    }

    fetchRecipes() {
        return this.http
            .get<Recipe[]>(`${API_URL}/recipes.json`)
            .pipe(
                // now since we are in a pipe method, we just add the second Observable methods after the exhaustMap
                map(recipes => {
                    return recipes.map(recipe => {
                        return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []}
                    })
                }),
                tap(recipes => {  
                    this.recipeService.setRecipes(recipes)
                })
            )
    }
}