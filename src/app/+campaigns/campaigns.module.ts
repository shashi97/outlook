import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartadminModule } from "../shared/smartadmin.module";
import { SmartadminValidationModule} from "../shared/forms/validation/smartadmin-validation.module";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { CampaignsRoutingModule } from './campaigns-routing.module';

import { IndexComponent } from './index/index.component';
import { EditComponent } from './edit/edit.component';
import { DetailsComponent } from './details/details.component';

@NgModule({
  imports: [
    CommonModule,
    CampaignsRoutingModule,
    NgxDatatableModule,
    SmartadminModule,
    SmartadminValidationModule
  ],
  declarations: [
    IndexComponent,
    EditComponent,
    DetailsComponent
  ]
})
export class CampaignsModule { }
