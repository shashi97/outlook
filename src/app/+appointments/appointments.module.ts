import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { SmartadminModule } from "../shared/smartadmin.module";
import { SmartadminValidationModule} from "../shared/forms/validation/smartadmin-validation.module";

import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { FormsModule } from '@angular/forms';

import { AppointmentsRoutingModule } from './appointments-routing.module';

import { IndexComponent } from './index/index.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { DetailsComponent } from './details/details.component';


@NgModule({
  imports: [
    CommonModule,
    AppointmentsRoutingModule,
    NgxDatatableModule,
    SmartadminModule,
    SmartadminValidationModule,
    FormsModule,
    NgbModule.forRoot()
  ],
  declarations: [
    IndexComponent,
    CreateComponent,
    EditComponent,
    DetailsComponent
  ]
})
export class AppointmentsModule { }
