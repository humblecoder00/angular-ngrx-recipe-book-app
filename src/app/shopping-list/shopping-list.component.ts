import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store'

import { LoggingService } from '../logging.service';
import { Ingredient } from '../shared/ingredient.model';
import * as fromShoppingList from './store/shopping-list.reducer'
import * as ShoppingListActions from './store/shopping-list.actions'

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})

export class ShoppingListComponent implements OnInit, OnDestroy {
  // have it undefined in the beginning
  // ingredients: Ingredient[]
  ingredients: Observable<{ ingredients: Ingredient[] }>

  constructor(
    private loggingService: LoggingService,
    private store: Store<fromShoppingList.AppState>
  ) {}

  // set the data at this step
  ngOnInit() {
    this.ingredients = this.store.select('shoppingList')
    // OR this.store.select('shoppingList').subscribe()

    this.loggingService.printLog('Hello from ShoppingListComponent ngOnInit!')
  }

  ngOnDestroy() {
    // this.igChangeSub.unsubscribe()
  }

  onEditItem(index: number) {
    this.store.dispatch(new ShoppingListActions.StartEdit(index))
  }
}
