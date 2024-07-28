import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './dashboard/header/header.component';


const routes: Routes = [
  { path: '', redirectTo: '/dashboardd', pathMatch: 'full' },
  { path: 'dashboardd', component: DashboardComponent},
  // { path: 'part-manage', component: AddDealerComponent, canActivate: [AuthGuard], data: { roles: ['Dealer'] } },
];

@NgModule({
  declarations: [
    DashboardComponent,
    HeaderComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class DealerModule { }
