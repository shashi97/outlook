import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailsComponent } from './details/details.component';
import { EditComponent } from './edit/edit.component';
import {AuthGuardService} from '../+auth/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'details', pathMatch: 'full', canActivate: [AuthGuardService]},
  { path: 'details', component: DetailsComponent, canActivate: [AuthGuardService]},
  { path: 'edit', component: EditComponent, canActivate: [AuthGuardService]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ProfileRoutingModule { }
