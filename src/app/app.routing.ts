/**
 * Created by griga on 7/11/16.
 */


import {Routes, RouterModule} from '@angular/router';
import {MainLayoutComponent} from "./shared/layout/app-layouts/main-layout.component";
import {AuthLayoutComponent} from "./shared/layout/app-layouts/auth-layout.component";
import {ModuleWithProviders} from "@angular/core";

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    data: {pageTitle: 'Dashboard'},
    children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {path: 'dashboard', loadChildren: 'app/+dashboard/dashboard.module#DashboardModule',data:{pageTitle: 'Dashboard'}},
      //{path: 'home', loadChildren: 'app/+home/home.module#HomeModule', data: {pageTitle: 'Home'}},
      {path: 'profile', loadChildren: 'app/+profile/profile.module#ProfileModule', data: {pageTitle: 'Profile'}},
      {path: 'properties', loadChildren: 'app/+properties/properties.module#PropertiesModule', data: {pageTitle: 'Properties'}},
      {path: 'accounts', loadChildren: 'app/+accounts/accounts.module#AccountsModule', data: {pageTitle: 'Accounts'}},
      {path: 'campaigns', loadChildren: 'app/+campaigns/campaigns.module#CampaignsModule', data: {pageTitle: 'Campaigns'}},
      {path: 'prospects', loadChildren: 'app/+prospects/prospects.module#ProspectsModule', data: {pageTitle: 'Prospects'}},
      {path: 'associates', loadChildren: 'app/+associates/associates.module#AssociatesModule', data: {pageTitle: 'Associates'}},
      {path: 'appointments', loadChildren: 'app/+appointments/appointments.module#AppointmentsModule', data: {pageTitle: 'Appointments'}},
      {path: 'agents', loadChildren: 'app/+agents/agents.module#AgentsModule', data: {pageTitle: 'Agents'}}
      
      // {path: 'dashboard', loadChildren: 'app/+dashboard/dashboard.module#DashboardModule',data:{pageTitle: 'Dashboard'}},
      // {path: 'smartadmin', loadChildren: 'app/+smartadmin-intel/smartadmin-intel.module#SmartadminIntelModule',data:{pageTitle: 'Smartadmin'}},
      // {path: 'app-views', loadChildren: 'app/+app-views/app-views.module#AppViewsModule',data:{pageTitle: 'App Views'}},
      // {path: 'calendar', loadChildren: 'app/+calendar/calendar.module#CalendarModule',data:{pageTitle: 'Calendar'}},
      // {path: 'e-commerce', loadChildren: 'app/+e-commerce/e-commerce.module#ECommerceModule',data:{pageTitle: 'E-commerce'}},
      // {path: 'forms', loadChildren: 'app/+forms/forms-showcase.module#FormsShowcaseModule',data:{pageTitle: 'Forms'}},
      // {path: 'graphs', loadChildren: 'app/+graphs/graphs-showcase.module#GraphsShowcaseModule',data:{pageTitle: 'Graphs'}},
      // {path: 'maps', loadChildren: 'app/+maps/maps.module#MapsModule',data:{pageTitle: 'Maps'}},
      // {path: 'miscellaneous', loadChildren: 'app/+miscellaneous/miscellaneous.module#MiscellaneousModule',data:{pageTitle: 'Miscellaneous'}},
       {path: 'outlook', loadChildren: 'app/+outlook/outlook.module#OutlookModule',data:{pageTitle: 'Outlook'}},
      // {path: 'tables', loadChildren: 'app/+tables/tables.module#TablesModule',data:{pageTitle: 'Tables'}},
      // {path: 'ui', loadChildren: 'app/+ui-elements/ui-elements.module#UiElementsModule',data:{pageTitle: 'Ui'}},
      // {path: 'widgets', loadChildren: 'app/+widgets/widgets-showcase.module#WidgetsShowcaseModule',data:{pageTitle: 'Widgets'}},
    ]
  },

  { path: 'auth', component: AuthLayoutComponent, loadChildren: 'app/+auth/auth.module#AuthModule'},

  {path: '**', redirectTo: 'dashboard'}
//
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {useHash: false});
