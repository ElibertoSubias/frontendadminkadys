import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ReportsComponent } from './reports.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { EntriesForTodayComponent } from './components/entries-for-today/entries-for-today.component';
import { OutForTodayComponent } from './components/out-for-today/out-for-today.component';
import { FutureOutsComponent } from './components/future-outs/future-outs.component';
import { FutureEntriesComponent } from './components/future-entries/future-entries.component';


@NgModule({
    declarations: [
        ReportsComponent,
        EntriesForTodayComponent,
        FutureOutsComponent,
        FutureEntriesComponent
    ],
    imports: [
        CommonModule,
        ReportsRoutingModule,
        SharedModule,
        OutForTodayComponent
    ]
})
export class ReportsModule { }
