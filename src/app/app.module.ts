import { NgModule, ApplicationRef } from '@angular/core';
import { HttpModule } from '@angular/http';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
/*
 * Platform and Environment providers/directives/pipes
 */
import { routing } from './app.routing'

// App is our top level component
import { AppComponent } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState, InternalStateType } from './app.service';

// Core providers
import {CoreModule} from "./core/core.module";
import {SmartadminLayoutModule} from "./shared/layout/layout.module";
import { ModalModule } from 'ngx-bootstrap/modal';
// import {SummernoteModule} from 'ng2-alt-summernote';

// Application Additions
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './+auth/token.interceptor';

//primeNg library
import {ChipsModule} from 'primeng/chips';
import {ToastModule} from 'ng2-toastr/ng2-toastr';
import { GoogleService } from "app/+outlook/shared/google.service";
// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppState
];

type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [ AppComponent ],
  imports: [ // import Angular's modules
    BrowserModule,
    HttpModule,
    BrowserAnimationsModule,
    FormsModule,
    ModalModule.forRoot(),
    CoreModule,
    SmartadminLayoutModule,
    routing,
    ChipsModule,
    ToastModule.forRoot()
  ],
  exports: [],
  providers: [
    GoogleService,
    APP_PROVIDERS,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    }

  ]
})
export class AppModule {
  constructor(public appRef: ApplicationRef, public appState: AppState) {}
}

