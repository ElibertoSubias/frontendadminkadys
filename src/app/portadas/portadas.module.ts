import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { PortadasComponent } from './components/portadas.component';
import { PortadasRoutingModule } from './portadas-routing.module';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';


@NgModule({
    declarations: [
        PortadasComponent
    ],
    imports: [
        CommonModule,
        PortadasRoutingModule,
        SharedModule,
        MatButtonModule, 
        MatIconModule,
        FormsModule, 
        ReactiveFormsModule
    ],
    providers: [provideHttpClient(), HttpClient]
})
export class PortadasModule { }
