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
        path: 'dress/:id',
        canActivate: [AppGuard],
        loadChildren: () => import('./detailItem/detailItem.module').then(m => m.DetailItemModule)
      },
      {
        path: 'new-dress',
        canActivate: [AppGuard],
        loadChildren: () => import('./addItem/addItem.module').then(m => m.AddItemModule)
      },
      {
        path: 'edit-dress/:id',
        canActivate: [AppGuard],
        loadChildren: () => import('./editItem/editItem.module').then(m => m.EditItemModule)
      },
      {
        path: 'reports',
        canActivate: [AppGuard],
        loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule)
      },
      {
        path: 'new-reservation/:id',
        canActivate: [AppGuard],
        loadChildren: () => import('./newReservation/newReservation.module').then(m => m.NewReservationModule)
      },
      {
        path: 'new-reservation',
        canActivate: [AppGuard],
        loadChildren: () => import('./newReservation/newReservation.module').then(m => m.NewReservationModule)
      },
      {
        path: 'edit-reservation/:_id',
        canActivate: [AppGuard],
        loadChildren: () => import('./newReservation/newReservation.module').then(m => m.NewReservationModule)
      },
      {
        path: 'corte',
        canActivate: [AppGuard],
        loadChildren: () => import('./corte-caja/corte-caja.module').then(m => m.CorteCajaModule)
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
