import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { OutForTodayComponent } from './components/out-for-today/out-for-today.component';
import { EntriesForTodayComponent } from './components/entries-for-today/entries-for-today.component';
import { FutureOutsComponent } from './components/future-outs/future-outs.component';
import { FutureEntriesComponent } from './components/future-entries/future-entries.component';

const routes: Routes = [
  {
    path:'',
    component: ReportsComponent,
    children: [
      {
        path:'entries-for-today',
        component: EntriesForTodayComponent
      },
      {
        path:'out-for-today',
        component: OutForTodayComponent
      },
      {
        path:'future-outs',
        component: FutureOutsComponent
      },
      {
        path:'future-entries',
        component: FutureEntriesComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule
  ]
})
export class ReportsRoutingModule {}
