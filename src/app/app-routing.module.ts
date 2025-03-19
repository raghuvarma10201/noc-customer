import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./authentication/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then( m => m.DashboardPageModule), 
    canActivate: [AuthGuard]
  },
  {
    path: 'list-noc',
    loadChildren: () => import('./pages/list-noc/list-noc.module').then( m => m.ListNocPageModule), 
    canActivate: [AuthGuard]
  },
  {
    path: 'noc-details/:id',
    loadChildren: () => import('./pages/details/details.module').then( m => m.DetailsPageModule), 
    canActivate: [AuthGuard]
  },

  {
    path: 'trialpit-form',
    loadChildren: () => import('./pages/trialpit-form/trialpit-form.module').then( m => m.TrialpitFormPageModule), 
    canActivate: [AuthGuard]
  },
  {
    path: 'asphalt-form',
    loadChildren: () => import('./pages/asphalt-form/asphalt-form.module').then( m => m.AsphaltFormPageModule), 
    canActivate: [AuthGuard]
  },
  {
    path: 'trial-pit-details',
    loadChildren: () => import('./pages/trial-pit-details/trial-pit-details.module').then( m => m.TrialPitDetailsPageModule), 
    canActivate: [AuthGuard]
  },
  {
    path: 'trialpit-resubmit',
    loadChildren: () => import('./pages/trialpit-resubmit/trialpit-resubmit.module').then( m => m.TrialpitResubmitPageModule), 
    canActivate: [AuthGuard]
  },
  {
    path: 'trialpit-reschedule',
    loadChildren: () => import('./pages/trialpit-reschedule/trialpit-reschedule.module').then( m => m.TrialpitReschedulePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'asphalt-details',
    loadChildren: () => import('./pages/asphalt-details/asphalt-details.module').then( m => m.AsphaltDetailsPageModule),
    canActivate: [AuthGuard]

  },
  {
    path: 'asphalt-reschedule',
    loadChildren: () => import('./pages/asphalt-reschedule/asphalt-reschedule.module').then( m => m.AsphaltReschedulePageModule),
    canActivate: [AuthGuard]

  },
  {
    path: 'comments',
    loadChildren: () => import('./pages/comments/comments.module').then( m => m.CommentsPageModule),
    canActivate: [AuthGuard]

  },
  {
    path: 'under-process-list',
    loadChildren: () => import('./pages/under-process-list/under-process-list.module').then( m => m.UnderProcessListPageModule),
    canActivate: [AuthGuard]

  },
  {
    path: 'completed-noc',
    loadChildren: () => import('./pages/completed-noc/completed-noc.module').then( m => m.CompletedNocPageModule),
    canActivate: [AuthGuard]

  },
  {
    path: 'customer-action-noc',
    loadChildren: () => import('./pages/customer-action-noc/customer-action-noc.module').then( m => m.CustomerActionNocPageModule),
    canActivate: [AuthGuard]

  },
  {
    path: 'building-inspection-details',
    loadChildren: () => import('./pages/building-inspection-details/building-inspection-details.module').then( m => m.BuildingInspectionDetailsPageModule),
    canActivate: [AuthGuard]

  },
  {
    path: 'building-inspection-form',
    loadChildren: () => import('./pages/building-inspection-form/building-inspection-form.module').then( m => m.BuildingInspectionFormPageModule),
    canActivate: [AuthGuard]

  },
  {
    path: 'building-inspection-reschedule',
    loadChildren: () => import('./pages/building-inspection-reschedule/building-inspection-reschedule.module').then( m => m.BuildingInspectionReschedulePageModule),
    canActivate: [AuthGuard]

  },
  {
    path: 'account',
    loadChildren: () => import('./pages/account/account.module').then( m => m.AccountPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'uaepassverification',
    loadChildren: () => import('./authentication/uaepassverification/uaepassverification.module').then( m => m.UaepassverificationPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./authentication/forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'change-password',
    loadChildren: () => import('./pages/change-password/change-password.module').then( m => m.ChangePasswordPageModule),
    canActivate: [AuthGuard]
  },



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
