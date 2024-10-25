import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { OutForTodayComponent } from './components/out-for-today/out-for-today.component';
import { EntriesForTodayComponent } from './components/entries-for-today/entries-for-today.component';
import { FutureOutsComponent } from './components/future-outs/future-outs.component';
import { AllReservationsComponent } from './components/all-reservations/all-reservations.component';
import { TodayReservationsComponent } from './components/today-reservations/today-reservations.component';
import { CanceledReservationsComponent } from './components/canceled-reservations/canceled-reservations.component';

const routes: Routes = [
  {
    path:'',
    component: ReportsComponent,
    children: [
      {
        path:'entries-for-today',
        component: EntriesForTodayComponent
      },
      {
        path:'out-for-today',
        component: OutForTodayComponent
      },
      {
        path:'future-outs',
        component: FutureOutsComponent
      },
      {
        path:'today',
        component: TodayReservationsComponent
      },
      {
        path:'all',
        component: AllReservationsComponent
      },
      {
        path:'canceled',
        component: CanceledReservationsComponent
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
export class ReportsRoutingModule {}
