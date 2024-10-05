import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ReportsComponent } from './components/reports.component';
import { ReportsRoutingModule } from './reports-routing.module';


@NgModule({
    declarations: [
        ReportsComponent
    ],
    imports: [
        CommonModule,
        ReportsRoutingModule,
        SharedModule
    ]
})
export class ReportsModule { }
