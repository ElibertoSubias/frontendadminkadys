import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { NewReservationComponent } from './components/newReservation.component';
import { NewReservationRoutingModule } from './newReservation-routing.module';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';


@NgModule({
    declarations: [
        NewReservationComponent
    ],
    imports: [
        CommonModule,
        NewReservationRoutingModule,
        SharedModule,
        MatButtonModule, 
        MatIconModule,
        FormsModule, 
        ReactiveFormsModule
    ],
    providers: [provideHttpClient(), HttpClient]
})
export class NewReservationModule { }
