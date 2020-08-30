import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { PipeLineComponent } from './features/pipe-line/pipe-line.component';
import { DashboardComponent } from './features/pipe-line/dashboard/dashboard.component';
import { LoanReviewComponent } from './features/loan-review/loan-review.component';
import { LoanOverviewComponent } from './features/loan-review/loan-overview/loan-overview.component';
import { IncomeVerificationComponent } from './features/loan-review/income-verification/income-verification.component';
import { ConditionsComponent } from './features/loan-review/conditions/conditions.component';


const routes: Routes = [
  {path:'',component:LayoutComponent,children:[
    {path:'pipe-line',component:PipeLineComponent},
    {path:'dashboard',component:DashboardComponent},
    {path:'loan-review',component:LoanReviewComponent,
      children:[
      {path: '', redirectTo: 'loan-overview', pathMatch: 'full'},
      {path:'loan-overview',component:LoanOverviewComponent},
      {path:'income-verfication',component:IncomeVerificationComponent},
      {path:'conditions',component:ConditionsComponent}
    ]}]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule {}
