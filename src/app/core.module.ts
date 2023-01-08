import { NgModule } from "@angular/core";
import { HTTP_INTERCEPTORS } from "@angular/common/http";

import { AuthInterceptorService } from "./auth/auth-interceptor.service";
import { RecipeService } from "./recipes/recipe.service";
import { ShoppingListService } from "./shopping-list/shopping-list.service";
import { LoggingService } from "./logging.service";

// You don't have to export services, because they work differently.
// They are automatically injected in the root level.
@NgModule({
    providers: [
        ShoppingListService,
        RecipeService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptorService,
          multi: true // set this to "true" even you are using one
        },
    ]
})
export class CoreModule {}