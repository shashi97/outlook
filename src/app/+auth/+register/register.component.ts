import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from "@angular/router";
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { NotificationService } from 'app/shared/utils/notification.service';
import { AuthService } from 'app/+auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { config } from '../../shared/smartadmin.config';

declare var $: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit {

  public emailAddress: string;
  public password: string;
  public passwordConfirmation: string;
  public lastName: string;
  public firstName: string;
  public title: string;
  public mobileNumber: string;

  bsModalRef: BsModalRef;
  public termsAgreed = false

  constructor(
    private router: Router,
    private modalService: BsModalService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit() {}

  private smartAlert (title: string, content: string): void {
    this.notificationService.smartMessageBox({
      title : '<i class=\'fa fa-sign-out txt-color-orangeDark\'></i>' + title + ' <span class=\'txt-color-orangeDark\'>' +
        '<strong>' + $('#show-shortcut').text() + '</strong></span>',
      content : content,
      buttons : '[OK]'
    });
  }

  private alertRegistered (): void {
    this.notificationService.smartMessageBox({
      title : '<i class=\'fa fa-sign-out txt-color-orangeDark\'></i> Success <span class=\'txt-color-orangeDark\'>' +
        '<strong>' + $('#show-shortcut').text() + '</strong></span>',
      content : 'Registration successfil. You will now be redirected to the Sign In screen.',
      buttons : '[OK]'
    }, () => {
      this.router.navigate(['/auth/login']);
    });
  }

  register(event) {
    event.preventDefault();

    if (!this.emailAddress || !this.emailAddress.includes("@rmt.com")) {
      this.smartAlert('Employees Only', 'This software is intended for use by the employees of RMT.  Registration requires an active email account in the @rmt.com domain.');
      return;
    }

    if ( !this.password || this.password.length < 12 ) {
      this.smartAlert('Insufficient Password Length', 'The password was too short.  Passwords must be 12 characters long or more.');
      return;
    }

    if (this.password !== this.passwordConfirmation) {
      this.smartAlert('Unconfirmed Password', 'The password was not confirmed.  The values in the fields are different.');
      return;
    }

    if (!this.firstName || !this.lastName) {
      this.smartAlert('Name Required', 'First and last name are required for registration.');
      return;
    }

    if (!this.title) {
      this.smartAlert('Title Required', 'A professional title is required. \'Broker\', \'Agent\', and \'Sales Associate\' are commonly-used examples.');
      return;
    }

    if (!this.mobileNumber) {
      this.smartAlert('Mobile Required', 'An active mobile service number is required to coordinate property visits.');
      return;
    }

    if ( !this.termsAgreed ) {
      this.smartAlert('Terms Agreement Required', 'Registration requires agreement with the software\'s Terms and Conditions.');
      return;
    }
    

    this.http.post(config.API_URL + '/accounts/register', {
        emailAddress: this.emailAddress,
        password: this.password,
        firstName: this.firstName,
        lastName: this.lastName,
        title: this.title,
        mobileNumber: this.mobileNumber
      }).subscribe(
        () => {
          this.alertRegistered();
          return;
        },
        (error) => {
          this.smartAlert('Server Error', 'Registration failed at the service. Please contact support for assitance.');
          return;
        }
    );
  }

  openModal(event, template: TemplateRef<any>) {
    event.preventDefault();
    this.bsModalRef = this.modalService.show(template);
  }

  onTermsAgree() {
    this.termsAgreed = true
    this.bsModalRef.hide()
  }

  onTermsClose() {
    this.bsModalRef.hide()
  }


}
