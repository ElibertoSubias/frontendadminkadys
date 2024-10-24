import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CorteCajaComponent } from './corte-caja.component';
import { CorteDiarioComponent } from './components/corte-diario/corte-diario.component';
import { EntriesForTodayComponent } from './components/entries-for-today/entries-for-today.component';
import { FutureOutsComponent } from './components/future-outs/future-outs.component';
import { AllReservationsComponent } from './components/all-reservations/all-reservations.component';

const routes: Routes = [
  {
    path:'',
    component: CorteCajaComponent,
    children: [
      {
        path:'entries-for-today',
        component: EntriesForTodayComponent
      },
      {
        path:'out-for-today',
        component: CorteDiarioComponent
      },
      {
        path:'future-outs',
        component: FutureOutsComponent
      },
      {
        path:'all',
        component: AllReservationsComponent
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
