import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndexComponent } from './index/index.component';
import { CreateComponent } from './create/create.component';
import { DetailsComponent } from './details/details.component';
import { EditComponent } from './edit/edit.component';
import { AuthGuardService } from '../+auth/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full', canActivate: [AuthGuardService]},
  { path: 'index', component: IndexComponent, canActivate: [AuthGuardService]},
  { path: 'create', component: CreateComponent, canActivate: [AuthGuardService]},
  { path: 'details/:id', component: DetailsComponent, canActivate: [AuthGuardService]},
  { path: 'edit/:id', component: EditComponent, canActivate: [AuthGuardService]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountsRoutingModule { }
