import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe
  id: number

  constructor(private recipeService: RecipeService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    // subscribe to route change
    // NOTE: Route Observables does not need cleanup since Angular handles it, but your own custom Observables do!
    this.route.params
      .subscribe((params: Params) => {
        this.id = +params['id']
        this.recipe = this.recipeService.getRecipe(this.id)
      })
  }

  onAddToShoppingList() {
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients)
  }

  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route })
    // a bit more complex version:
    // this.router.navigate(['../', this.id, 'edit'], { relativeTo: this.route })
  }

  onDeleteRecipe() {
    this.recipeService.deleteRecipe(this.id)
    // navigate:
    this.router.navigate(['/recipes'])
  }
}
