import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { CorteCajaComponent } from './corte-caja.component';
import { CorteCajaRoutingModule } from './corte-caja-routing.module';
import { CorteDiarioComponent } from './components/corte-diario/corte-diario.component';


@NgModule({
    declarations: [
        CorteCajaComponent
    ],
    imports: [
        CommonModule,
        CorteCajaRoutingModule,
        SharedModule,
        CorteDiarioComponent
    ]
})
export class CorteCajaModule { }
