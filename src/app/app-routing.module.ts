import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const appRoutes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  // loadChildren - () => import('relativePathToYourModule').then(m => m.NameOfYourModule)
  { path: 'recipes', loadChildren: () => import('./recipes/recipes.module').then(m => m.RecipesModule) },
  { path: 'shopping-list', loadChildren: () => import('./shopping-list/shopping-list.module').then(m => m.ShoppingListModule) },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },

  // {
  //   path: 'recipes',
  //   component: RecipesComponent,
  //   canActivate: [AuthGuard],
  //   children: [
  //     { path: '', component: RecipeStartComponent },
  //     { path: 'new', component: RecipeEditComponent },
  //     { path: ':id', component: RecipeDetailComponent, resolve: [RecipesResolverService] },
  //     { path: ':id/edit', component: RecipeEditComponent, resolve: [RecipesResolverService] },
  //   ] 
  // },
  // { path: 'shopping-list', component: ShoppingListComponent },
  // { path: 'auth', component: AuthComponent}
]

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules })
  ],
  // export the parts like module.exports
  exports: [RouterModule]
})

export class AppRoutingModule { }
