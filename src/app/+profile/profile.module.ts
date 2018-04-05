import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProfileRoutingModule} from './profile-routing.module';
import { SmartadminModule } from "../shared/smartadmin.module";
import { SmartadminValidationModule} from "../shared/forms/validation/smartadmin-validation.module";


import { EditComponent } from './edit/edit.component';
import { DetailsComponent } from './details/details.component';

@NgModule({
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SmartadminModule,
    SmartadminValidationModule
  ],
  declarations: [
    EditComponent,
    DetailsComponent
  ]
})
export class ProfileModule {
}
