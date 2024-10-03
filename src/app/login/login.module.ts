import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './components/login.component';
import { LoginRoutingModule } from './login-routing.module';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';


@NgModule({
    declarations: [
        LoginComponent
    ],
    imports: [
        CommonModule,
        LoginRoutingModule,
        SharedModule,
        MatButtonModule, 
        MatIconModule,
        FormsModule, 
        ReactiveFormsModule
    ],
    providers: [provideHttpClient(), HttpClient]
})
export class LoginModule { }
