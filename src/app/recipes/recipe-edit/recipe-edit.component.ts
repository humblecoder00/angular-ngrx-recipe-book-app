import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms'
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number
  editMode = false
  recipeForm: FormGroup

  get ingredientsControls() {
    return (this.recipeForm.get('ingredients') as FormArray).controls
  }

  constructor(private route: ActivatedRoute, private recipeService: RecipeService, private router: Router) { }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id']

          // determine if it is in new mode or edit, by checking if there is param or not
          // so if there is a url id param, it means we are in the edit mode - otherwise it's a new recipe
          this.editMode = params['id'] != null
          // this gets called whenever the route changes, hence the route params subscribe.
          this.initForm()
        })
    }

    onSubmit() {
      // const newRecipe = new Recipe(
      //   this.recipeForm.value['name'],
      //   this.recipeForm.value['description'],
      //   this.recipeForm.value['imagePath'],
      //   this.recipeForm.value['ingredients'],
      // )
      // OR simply this.recipeForm.value, since names are same and it includes all values we want

      if (this.editMode) {
        this.recipeService.updateRecipe(this.id, this.recipeForm.value)
      } else {
        this.recipeService.addRecipe(this.recipeForm.value)
      }

      // go back to updated recipe
      // FROM http://localhost:4200/recipes/0/edit to http://localhost:4200/recipes/0/
      // Just by going one step up. Have a good url structure to get advantage of this
      this.router.navigate(['../'], { relativeTo: this.route })
    }

    onAddIngredient() {
      // explicitly cast that this is a FormArray, to push the FormControls:
      (<FormArray>this.recipeForm.get('ingredients')).push(
        new FormGroup({
          'name': new FormControl(null, Validators.required),
          'amount': new FormControl(null, [
            Validators.required,
            Validators.pattern(/^[1-9]+[0-9]*$/)
          ])
        })
      )
    }

    onDeleteIngredient(index: number) {
      (<FormArray>this.recipeForm.get('ingredients')).removeAt(index)
    }

    onCancel() {
      // go one step back
      this.router.navigate(['../'], { relativeTo: this.route })
    }

    private initForm() {
      let recipeName = ''
      let recipeImagePath = ''
      let recipeDescription = ''
      let recipeIngredients = new FormArray([])
      
      if (this.editMode) {
        const recipe = this.recipeService.getRecipe(this.id)
        recipeName = recipe.name
        recipeImagePath = recipe.imagePath
        recipeDescription = recipe.description
        if (recipe['ingredients']) {
          for (let ingredient of recipe.ingredients) {
            recipeIngredients.push(
              new FormGroup({
                'name': new FormControl(ingredient.name, Validators.required),
                'amount': new FormControl(ingredient.amount, [
                  Validators.required,
                  Validators.pattern(/^[1-9]+[0-9]*$/)
                ])
              })
            )
          }
        }
      }

      this.recipeForm = new FormGroup({
        'name': new FormControl(recipeName, Validators.required),
        'imagePath': new FormControl(recipeImagePath, Validators.required),
        'description': new FormControl(recipeDescription, Validators.required),
        'ingredients': recipeIngredients
      })
    }
}
