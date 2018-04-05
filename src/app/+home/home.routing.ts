import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from "./home.component";
import {ModuleWithProviders} from "@angular/core";
import {AuthGuardService} from '../+auth/auth-guard.service';

export const homeRoutes: Routes = [
    {
        path: '',
        component: HomeComponent,
        data: {
            pageTitle: 'Home'
        },
        canActivate: [AuthGuardService]
    }
];

export const homeRouting:ModuleWithProviders = RouterModule.forChild(homeRoutes);

