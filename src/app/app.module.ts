import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
// import { RecipesModule } from './recipes/recipes.module';
// import { ShoppingListModule } from './shopping-list/shopping-list.module';
import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { CoreModule } from './core.module';
// import { AuthModule } from './auth/auth.module';
import { LoggingService } from './logging.service';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule, // Global services
    AppRoutingModule,
    // RecipesModule, // Lazy loaded, therefore it is excluded to prevent double loading
    // ShoppingListModule, // Lazy loaded, therefore it is excluded to prevent double loading
    // AuthModule, // Lazy loaded, therefore it is excluded to prevent double loading
    SharedModule,
    CoreModule,
  ],
  // providers: [LoggingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
