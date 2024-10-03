import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { EditMovieComponent } from './components/editMovie.component';
import { EditMovieRoutingModule } from './editMovie-routing.module';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';


@NgModule({
    declarations: [
        EditMovieComponent
    ],
    imports: [
        CommonModule,
        EditMovieRoutingModule,
        SharedModule,
        MatButtonModule, 
        MatIconModule,
        FormsModule, 
        ReactiveFormsModule
    ],
    providers: [provideHttpClient(), HttpClient]
})
export class EditMovieModule { }
