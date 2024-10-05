import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { DetailItemComponent } from './components/detailItem.component';
import { DetailItemRoutingModule } from './detailItem-routing.module';


@NgModule({
    declarations: [
        DetailItemComponent
    ],
    imports: [
        CommonModule,
        DetailItemRoutingModule,
        SharedModule
    ]
})
export class DetailItemModule { }
