import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartadminModule } from "../shared/smartadmin.module";
import { SmartadminValidationModule} from "../shared/forms/validation/smartadmin-validation.module";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";

import { PropertiesRoutingModule } from './properties-routing.module';

import { IndexComponent } from './index/index.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { DetailsComponent } from './details/details.component';

@NgModule({
  imports: [
    CommonModule,
    PropertiesRoutingModule,
    NgxDatatableModule,
    SmartadminModule,
    SmartadminValidationModule
  ],
  declarations: [
    IndexComponent,
    CreateComponent,
    EditComponent,
    DetailsComponent
  ]
})
export class PropertiesModule { }
