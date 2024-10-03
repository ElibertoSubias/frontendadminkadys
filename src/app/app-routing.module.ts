import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { ContentLayoutComponent } from './layout/components/content-layout/content-layout.component';
import { AppGuard } from './guards/auth.guard';

export const APP_ROUTES: Routes = [
  {
    path: 'login',
    data: { title: 'Login' },
    loadChildren: () => import('./login/login.module').then((m) => m.LoginModule),
  },
  {
    path:'',
    component: ContentLayoutComponent,
    canActivate: [AppGuard],
    data: { title: 'Home' },
    children: [
      {
        path:'',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        canActivate: [AppGuard],
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
      },
      {
        path: 'home/:filter',
        canActivate: [AppGuard],
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
      },
      {
        path: 'movie/:id',
        canActivate: [AppGuard],
        loadChildren: () => import('./detailMovie/detailMovie.module').then(m => m.DetailMovieModule)
      },
      {
        path: 'new-movie',
        canActivate: [AppGuard],
        loadChildren: () => import('./addMovie/addMovie.module').then(m => m.AddMovieModule)
      },
      {
        path: 'edit-movie/:id',
        canActivate: [AppGuard],
        loadChildren: () => import('./editMovie/editMovie.module').then(m => m.EditMovieModule)
      },
      {
          path: '**',
          redirectTo: 'home',
          pathMatch: 'full',
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(APP_ROUTES,{
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
