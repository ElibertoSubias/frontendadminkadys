import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ReportsComponent } from './reports.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { EntriesForTodayComponent } from './components/entries-for-today/entries-for-today.component';
import { OutForTodayComponent } from './components/out-for-today/out-for-today.component';
import { FutureOutsComponent } from './components/future-outs/future-outs.component';
import { AllReservationsComponent } from './components/all-reservations/all-reservations.component';
import { TodayReservationsComponent } from './components/today-reservations/today-reservations.component';
import { CanceledReservationsComponent } from './components/canceled-reservations/canceled-reservations.component';
import { HttpClient, provideHttpClient } from '@angular/common/http';


@NgModule({
    declarations: [
        ReportsComponent,
        EntriesForTodayComponent,
        FutureOutsComponent,
        AllReservationsComponent,
        TodayReservationsComponent

    ],
    imports: [
        CommonModule,
        ReportsRoutingModule,
        SharedModule,
        OutForTodayComponent,
        CanceledReservationsComponent
    ],
    providers: [provideHttpClient(), HttpClient]
})
export class ReportsModule { }
