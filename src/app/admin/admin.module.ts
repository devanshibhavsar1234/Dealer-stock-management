import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RouterModule, Routes } from '@angular/router';

import { HeaderComponent } from './dashboard/header/header.component';
import { AuthenticationModule } from '../authentication/authentication.module';
import { AddDealerComponent } from './dashboard/add-dealer/add-dealer.component';
import { AddMechanicComponent } from './dashboard/add-mechanic/add-mechanic.component';
import { AddPartsComponent } from './dashboard/add-parts/add-parts.component';
import { AuthGuard } from '../guard/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';


const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent},
  { path: 'add-dealer', component: AddDealerComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] } },
 
  { path: 'add-mechanic', component: AddMechanicComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] } },
  { path: 'add-parts', component: AddPartsComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] } },

 
  
];

@NgModule({
  declarations: [
    HeaderComponent,
   DashboardComponent,
   AddDealerComponent,
   AddMechanicComponent,
   AddPartsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
   
  ],
  exports: [RouterModule]
})
export class AdminModule { }
