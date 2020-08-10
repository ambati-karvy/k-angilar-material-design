import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { PipeLineComponent } from './features/pipe-line/pipe-line.component';
import { DashboardComponent } from './features/pipe-line/dashboard/dashboard.component';


const routes: Routes = [
  {path:'',component:LayoutComponent,children:[
    {path:'pipe-line',component:PipeLineComponent},
    {path:'dashboard',component:DashboardComponent}]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule {}
