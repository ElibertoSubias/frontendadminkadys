import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { DetailMovieComponent } from './components/detailMovie.component';
import { DetailMovieRoutingModule } from './detailMovie-routing.module';


@NgModule({
    declarations: [
        DetailMovieComponent
    ],
    imports: [
        CommonModule,
        DetailMovieRoutingModule,
        SharedModule
    ]
})
export class DetailMovieModule { }
