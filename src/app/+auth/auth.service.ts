import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { Credentials } from '../../models/credentials';
import { config } from '../shared/smartadmin.config';

@Injectable()
export class AuthService {

  static isRefreshInProgress: boolean = false;
  redirectUrl: string;

  constructor(private http: HttpClient) { }

  isLoggedIn(): boolean {
    return this.getToken() ? true : false;
  }

  login(username: string, password: string) {
    return this.http.post<Credentials>(config.API_URL + '/authentication/login', {username, password})
    .do((response) => {
      this.setToken(response.token, response.expiresAt, response.claims);
      return;
    })
  }

  logout(): void {
    localStorage.removeItem('TOKEN');
    localStorage.removeItem('EXPIRES_AT');
    localStorage.removeItem('CLAIMS');
    this.redirectUrl = "";
    
    return;
  }

  getToken(): string {
    if (
      !localStorage.getItem('TOKEN') ||
      !localStorage.getItem('EXPIRES_AT') ||
      !(moment().utc().isBefore(moment(localStorage.getItem("EXPIRES_AT")).utc()))
    ) {
      this.logout();
      return "";

    }

    if (moment(localStorage.getItem('EXPIRES_AT')).utc().diff(moment().utc(), "minutes") <= 15 && !AuthService.isRefreshInProgress) {
      AuthService.isRefreshInProgress = true;
      try {
        this.refreshToken();
      } catch (error) {
        console.error(error);
      }
      AuthService.isRefreshInProgress = false;
    }

    return localStorage.getItem('TOKEN');
  }

  getClaims(): any {
    return JSON.parse(localStorage.getItem('CLAIMS'));
  }

  setToken(token: string, expiresAt: string, claims: any): void {
    localStorage.setItem('TOKEN', token);
    localStorage.setItem('EXPIRES_AT', expiresAt);
    localStorage.setItem('CLAIMS', JSON.stringify(claims));
    return;
  }

  refreshToken() {
    return this.http.get<Credentials>(config.API_URL + '/authentication/refresh')
    .do((response) => {
      this.setToken(response.token, response.expiresAt, response.claims);
    })
  }
}





