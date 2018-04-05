import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/+auth/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from 'app/shared/utils/notification.service';

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  public emailAddress: string;
  public password: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService) {
  }

  ngOnInit() {
  }

  alertNoCredentials() {
    this.notificationService.smartMessageBox({
      title : '<i class=\'fa fa-sign-out txt-color-orangeDark\'></i> Credentials <span class=\'txt-color-orangeDark\'>' +
        '<strong>' + $('#show-shortcut').text() + '</strong></span>',
      content : 'Please enter your email address and password before clicking the \'Sign in\' button.',
      buttons : '[OK]'

    });
  }

  alertFailedLogin() {
    this.notificationService.smartMessageBox({
      title : '<i class=\'fa fa-sign-out txt-color-orangeDark\'></i> Access Denied <span class=\'txt-color-orangeDark\'>' +
        '<strong>' + $('#show-shortcut').text() + '</strong></span>',
      content : 'The email and password combination you provided could not be authenticated.',
      buttons : '[OK]'

    });
  }

  login(event) {

    event.preventDefault();

    if (!this.emailAddress || !this.password) {
      this.alertNoCredentials();
      return;
    }

    this.authService
      .login(this.emailAddress, this.password)
      .subscribe(
        (response) => {
          if (this.authService.redirectUrl) {
            this.router.navigateByUrl(this.authService.redirectUrl);  
          } else {
            this.router.navigateByUrl('/');
          }
          return;
        },
        (error) => {
          console.log(error);
          this.alertFailedLogin();
          return;
        }
    );
  }
}
