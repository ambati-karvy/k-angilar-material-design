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




@NgModule({
  declarations: [
    LayoutComponent,
    TopBarComponent,
    SideBarComponent,
    PipeLineComponent,
    FileProgressComponent,
    ProgressDirective,
    DashboardComponent,
    

  ],
  imports: [
    CommonModule,
    WelcomeMaterialModule,
    LayoutRoutingModule
  ]
})
export class LayoutModule { }
