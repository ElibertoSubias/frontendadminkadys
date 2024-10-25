import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PortadasComponent } from './components/portadas.component';

const routes: Routes = [
  {
    path:'',
    component: PortadasComponent
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
export class PortadasRoutingModule {}
