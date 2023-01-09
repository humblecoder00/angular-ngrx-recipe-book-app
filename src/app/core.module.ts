import { NgModule } from '@angular/core'
import { HTTP_INTERCEPTORS } from '@angular/common/http'

import { AuthInterceptorService } from './auth/auth-interceptor.service'
import { RecipeService } from './recipes/recipe.service'

// You don't have to export services, because they work differently.
// They are automatically injected in the root level.
@NgModule({
    providers: [
        RecipeService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptorService,
            multi: true, // set this to "true" even you are using one
        },
    ],
})
export class CoreModule {}
