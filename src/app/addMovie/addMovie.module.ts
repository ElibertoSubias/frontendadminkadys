import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { AddMovieComponent } from './components/addMovie.component';
import { AddMovieRoutingModule } from './addMovie-routing.module';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';


@NgModule({
    declarations: [
        AddMovieComponent
    ],
    imports: [
        CommonModule,
        AddMovieRoutingModule,
        SharedModule,
        MatButtonModule, 
        MatIconModule,
        FormsModule, 
        ReactiveFormsModule
    ],
    providers: [provideHttpClient(), HttpClient]
})
export class AddMovieModule { }
