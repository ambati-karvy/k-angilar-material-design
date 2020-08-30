import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { PipeLineComponent } from './features/pipe-line/pipe-line.component';
import { WelcomeMaterialModule } from '../material/common.material.module';
import { LayoutRoutingModule } from './lay-routing.module';
import { FileProgressComponent } from './features/file-progress.component';
import { ProgressDirective } from './features/progress.directive';
import { DashboardComponent } from './features/pipe-line/dashboard/dashboard.component';
import { LoanReviewComponent } from './features/loan-review/loan-review.component';
import { LoanOverviewComponent } from './features/loan-review/loan-overview/loan-overview.component';
import { IncomeVerificationComponent } from './features/loan-review/income-verification/income-verification.component';
import { ConditionsComponent } from './features/loan-review/conditions/conditions.component';
import { DocumentsComponent } from './features/loan-review/documents/documents.component';




@NgModule({
  declarations: [
    LayoutComponent,
    TopBarComponent,
    SideBarComponent,
    PipeLineComponent,
    FileProgressComponent,
    ProgressDirective,
    DashboardComponent,
    LoanReviewComponent,
    LoanOverviewComponent,
    IncomeVerificationComponent,
    ConditionsComponent,
    DocumentsComponent,
    

  ],
  imports: [
    CommonModule,
    WelcomeMaterialModule,
    LayoutRoutingModule
  ]
})
export class LayoutModule { }
