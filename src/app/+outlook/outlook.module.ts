
import { NgModule } from '@angular/core';

import { SmartadminModule } from '../shared/smartadmin.module'

import { routing } from './outlook.routing';


import { OutlookComponent } from "./outlook.component";
import { FolderComponent } from "./folder/folder.component";
import { DetailsComponent } from "./details/details.component";
import { ReplayComponent } from "./replay/replay.component";
import { ComposeComponent } from "./compose/compose.component";
import { OutlookService } from "./shared/outlook.service";
import { MessageLabelsComponent } from "./shared/message-labels.component";
import { SmartadminEditorsModule } from "../shared/forms/editors/smartadmin-editors.module";
import { GmailComponent } from './gmail/gmail.component';
import {ChipsModule} from 'primeng/chips';

 import { ArraySortPipe } from "app/shared/pipes/sort.pipe";
@NgModule({
  declarations: [
    OutlookComponent,
    FolderComponent,
    DetailsComponent,
    ReplayComponent,
    ComposeComponent,
    ArraySortPipe,
    MessageLabelsComponent,
    GmailComponent
  ],
  imports: [
    // SummernoteModule,
    ChipsModule,
    SmartadminModule,
    routing,

    SmartadminEditorsModule,
  ],
  providers: [OutlookService],
  entryComponents: [OutlookComponent],
})
export class OutlookModule {

}
