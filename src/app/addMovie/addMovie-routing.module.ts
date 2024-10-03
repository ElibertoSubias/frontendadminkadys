import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddMovieComponent } from './components/addMovie.component';

const routes: Routes = [
  {
    path:'',
    component: AddMovieComponent
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
export class AddMovieRoutingModule {}
