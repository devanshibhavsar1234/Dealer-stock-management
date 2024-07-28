import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule)
  },

  {
    path: 'dealer',
    loadChildren: () => import('./dealer/dealer.module').then(m => m.DealerModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard]
  },
  // {
  //   path: 'mechanic',
  //   loadChildren: () => import('./features/mechanic/mechanic.module').then(m => m.MechanicModule),
  //   canActivate: [AuthGuard]
  // },
  // {
  //   path: 'part',
  //   loadChildren: () => import('./features/part/part.module').then(m => m.PartModule),
  //   canActivate: [AuthGuard]
  // },
  // {
  //   path: 'part-management',
  //   loadChildren: () => import('./features/part-management/part-management.module').then(m => m.PartManagementModule),
  //   canActivate: [AuthGuard]
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
