import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms'
import { Subscription } from 'rxjs'
import { Store } from '@ngrx/store'
import { Ingredient } from 'src/app/shared/ingredient.model';

import * as ShoppingListActions from '../store/shopping-list.actions'
import * as fromApp from '../../store/app.reducer'

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})

export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', { static: false }) slForm: NgForm
  subscription: Subscription
  editMode = false
  editedItem: Ingredient

  constructor(
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    // listen to store changes via subscribe:
    this.subscription = this.store.select('shoppingList')
      .subscribe(stateData => {
        if (stateData.editedIngredientIndex > -1) {
          this.editMode = true
          this.editedItem = stateData.editedIngredient
          // target the form, which we have access through ViewChild
          this.slForm.setValue({
            name: this.editedItem.name,
            amount: this.editedItem.amount
          })
        } else {
          this.editMode = false
        }
      })
  }

  onSubmitItem(form: NgForm) {
    // event.preventDefault()
    const value = form.value
    const newIngredient = new Ingredient(value.name, value.amount)
    if (this.editMode) {
      this.store.dispatch(
        new ShoppingListActions.UpdateIngredient(newIngredient))
    } else {
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient))
    }
    this.onClear()
  }

  onClear() {
    this.slForm.reset()
    this.editMode = false
    this.store.dispatch(new ShoppingListActions.StopEdit())
  }

  onDelete() {
    this.store.dispatch(new ShoppingListActions.DeleteIngredient())
    this.onClear()
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
    this.store.dispatch(new ShoppingListActions.StopEdit()) // reset to initial so it won't look same when you edit again
  }
}
