import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailMovieComponent } from './components/detailMovie.component';

const routes: Routes = [
  {
    path:'',
    component: DetailMovieComponent
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
export class DetailMovieRoutingModule {}
