import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CorteCajaComponent } from './corte-caja.component';
import { CorteDiarioComponent } from './components/corte-diario/corte-diario.component';

const routes: Routes = [
  {
    path:'',
    component: CorteCajaComponent,
    children: [
      {
        path:'out-for-today',
        component: CorteDiarioComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule
  ]
})
export class CorteCajaRoutingModule {}
