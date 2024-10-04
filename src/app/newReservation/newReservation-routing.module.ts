import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewReservationComponent } from './components/newReservation.component';

const routes: Routes = [
  {
    path:'',
    component: NewReservationComponent
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
export class NewReservationRoutingModule {}
