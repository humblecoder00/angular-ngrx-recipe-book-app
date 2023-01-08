import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { SharedModule } from "../shared/shared.module";
import { ShoppingEditComponent } from "./shopping-edit/shopping-edit.component";
import { ShoppingListComponent } from "./shopping-list.component";

@NgModule({
    // add components
    declarations: [
        ShoppingListComponent,
        ShoppingEditComponent,
    ],
    // add CommonModule instead of BrowserModule in your feature modules
    imports: [
        SharedModule,
        FormsModule,
        RouterModule.forChild([
            { path: '', component: ShoppingListComponent }
        ]),
    ],
    providers: [],
    exports: []
})

export class ShoppingListModule {}