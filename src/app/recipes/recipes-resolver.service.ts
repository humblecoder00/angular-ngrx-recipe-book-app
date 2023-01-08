import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";

import { DataStorageService } from "../shared/data-storage.service";
import { Recipe } from "./recipe.model";
import { RecipeService } from "./recipe.service";

@Injectable({ providedIn: 'root' })
export class RecipesResolverService implements Resolve<Recipe[]> {
    constructor(private dataStorageService: DataStorageService, private recipesService: RecipeService) {}

    /*
    Used for edge case example.
    If we visit a route, for example /recipes/2 and haven't fetched any data, app will crash
    So for that case we'll call the api to fetch the data by using the resolver - so data can be there
    We trigger this only if there is no recipes present, otherwise we get a bug with edit.
    Because it fires everytime before we visit the route, hence sends the request everytime as well.
    */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const recipes = this.recipesService.getRecipes()

        if (recipes.length === 0) {
            return this.dataStorageService.fetchRecipes()
        } else {
            return recipes
        }
    }
}