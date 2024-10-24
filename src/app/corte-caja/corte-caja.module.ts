import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { CorteCajaComponent } from './corte-caja.component';
import { CorteCajaRoutingModule } from './corte-caja-routing.module';
import { EntriesForTodayComponent } from './components/entries-for-today/entries-for-today.component';
import { CorteDiarioComponent } from './components/corte-diario/corte-diario.component';
import { FutureOutsComponent } from './components/future-outs/future-outs.component';
import { AllReservationsComponent } from './components/all-reservations/all-reservations.component';


@NgModule({
    declarations: [
        CorteCajaComponent,
        EntriesForTodayComponent,
        FutureOutsComponent,
        AllReservationsComponent
    ],
    imports: [
        CommonModule,
        CorteCajaRoutingModule,
        SharedModule,
        CorteDiarioComponent
    ]
})
export class CorteCajaModule { }
