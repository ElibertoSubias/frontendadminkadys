import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditMovieComponent } from './components/editMovie.component';

const routes: Routes = [
  {
    path:'',
    component: EditMovieComponent
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
export class EditMovieRoutingModule {}
