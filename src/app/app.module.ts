import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { HttpClientModule } from '@angular/common/http'
import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'
// import { StoreRouterConnectingModule } from '@ngrx/router-store'

import { AppRoutingModule } from './app-routing.module'
import { SharedModule } from './shared/shared.module'

import { AppComponent } from './app.component'
import { HeaderComponent } from './header/header.component'
import { CoreModule } from './core.module'
import { environment } from '../environments/environment'
import * as fromApp from './store/app.reducer'
import { AuthEffects } from './auth/store/auth.effects'
import { RecipeEffects } from './recipes/store/recipe.effects'

@NgModule({
    declarations: [AppComponent, HeaderComponent],
    imports: [
        BrowserModule,
        HttpClientModule, // Global services
        AppRoutingModule,
        // RecipesModule, // Lazy loaded, therefore it is excluded to prevent double loading
        // ShoppingListModule, // Lazy loaded, therefore it is excluded to prevent double loading
        // AuthModule, // Lazy loaded, therefore it is excluded to prevent double loading
        StoreModule.forRoot(fromApp.appReducer),
        EffectsModule.forRoot([AuthEffects, RecipeEffects]),
        StoreDevtoolsModule.instrument({
            logOnly: environment.production,
        }),
        // StoreRouterConnectingModule.forRoot(), // NgRx router module - use when needed
        SharedModule,
        CoreModule,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
