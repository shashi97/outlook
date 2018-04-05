import {ModuleWithProviders} from "@angular/core"
import {Routes, RouterModule} from '@angular/router';
import { AuthGuardService } from '../+auth/auth-guard.service'


export const routes: Routes = [
  {
    path: '', redirectTo: 'analytics', pathMatch: 'full'
  },
  {
    path: 'analytics',
    loadChildren:'./+analytics/analytics.module#AnalyticsModule',
    canActivate: [AuthGuardService]
  },
  {
    path: 'social',
    loadChildren:'./+social/social.module#SocialModule',
    canActivate: [AuthGuardService]
  }
];

export const routing = RouterModule.forChild(routes);
