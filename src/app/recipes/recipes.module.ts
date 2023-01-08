import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { SharedModule } from "../shared/shared.module";
import { RecipeDetailComponent } from "./recipe-detail/recipe-detail.component";
import { RecipeEditComponent } from "./recipe-edit/recipe-edit.component";
import { RecipeItemComponent } from "./recipe-list/recipe-item/recipe-item.component";
import { RecipeListComponent } from "./recipe-list/recipe-list.component";
import { RecipeStartComponent } from "./recipe-start/recipe-start.component";
import { RecipesRoutingModule } from "./recipes-routing.module";
import { RecipesComponent } from "./recipes.component";

@NgModule({
    // add components
    declarations: [
        RecipesComponent,
        RecipeListComponent,
        RecipeDetailComponent,
        RecipeItemComponent,
        RecipeStartComponent,
        RecipeEditComponent,
    ],
    // add CommonModule instead of BrowserModule in your feature modules
    imports: [
        RouterModule,
        ReactiveFormsModule,
        RecipesRoutingModule,
        SharedModule
    ],
    // since these components are loaded via router module & not used anywhere else, 
    // we don't have to explicitly export them here anymore:
    exports: [
        // RecipesComponent,
        // RecipeListComponent,
        // RecipeDetailComponent,
        // RecipeItemComponent,
        // RecipeStartComponent,
        // RecipeEditComponent,
    ]
})

export class RecipesModule {}