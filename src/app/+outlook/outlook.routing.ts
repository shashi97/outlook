
import {ModuleWithProviders} from "@angular/core"
import {Routes, RouterModule} from "@angular/router";
import {OutlookComponent} from "./outlook.component";
import {FolderComponent} from "./folder/folder.component";
import {DetailsComponent} from "./details/details.component";
import {ReplayComponent} from "./replay/replay.component";
import {ComposeComponent} from "./compose/compose.component";
import { GmailComponent } from './gmail/gmail.component';

export const routes: Routes = [
  {
    path: '',
    component: OutlookComponent,
    children: [
      {
        path: '',
        redirectTo: 'INBOX',
        pathMatch: 'full'
      },

      {
        path: 'details/:id',
        component: DetailsComponent
      },
      {
        path: 'reply/:id',
        component: ReplayComponent
      },
      {
        path: 'forward/:id',
        component: ReplayComponent
      },
      {
        path: 'compose',
        component: ComposeComponent
      },
      {
        path: 'compose/:id',
        component: ComposeComponent
      },
      {
        path: ':folder',
        component: FolderComponent
      },
      {
        path: 'signin',
        component: GmailComponent
      }
    ]
  }
];


export const routing = RouterModule.forChild(routes);
