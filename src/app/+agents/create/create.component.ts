import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FadeInTop } from "../../shared/animations/fade-in-top.decorator";
import { NotificationService } from 'app/shared/utils/notification.service';
import { JsonApiService } from "../../core/api/json-api.service";

declare var $: any;

@FadeInTop()
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  public username: string;
  public password: string;
  public isAdministrator: boolean = false;
  public isContentTechnician: boolean = false;
  public isCaptureTechnician: boolean = false;
  public isBroker: boolean = false;
  public isAgent: boolean = false;
  public isAssistant: boolean = false;

  public validationOptions:any = {

    // Rules for form validation
    rules: {
      emailAddress: {
        required: true,
        email: true
      },
      password: {
        required: true,
        minlength: 12,
        maxlength: 256
      },
      passwordConfirm: {
        required: true,
        minlength: 12,
        maxlength: 256,
        equalTo: '#password'
      }
    },

    // Messages for form validation
    messages: {
      emailAddress: {
        required: 'Please enter an email address to be the account\'s username.',
        email: 'Please enter a VALID email address to be the account\'s username.'
      },
      password: {
        required: 'Please enter a password for the new user account.'
      },
      passwordConfirm: {
        required: 'Please confirm the password.',
        equalTo: 'Please enter the same password as above.'
      }
    }
  };

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private jsonApiService: JsonApiService) {}

  ngOnInit() {
  }

  onSubmit(){
    this.createAccount();
  }

  onClickCancel(event){
    this.router.navigateByUrl("/accounts");
  }

  createAccount(){
    this.jsonApiService.post('/accounts', {
      username: this.username,
      password: this.password,
      isAdministrator: this.isAdministrator,
      isContentTechnician: this.isContentTechnician,
      isCaptureTechnician: this.isCaptureTechnician,
      isBroker: this.isBroker,
      isAgent: this.isAgent,
      isAssistant: this.isAssistant
    }).subscribe(data=> {
      this.notificationService.smartMessageBox(
        {
          title : '<i class=\'fa fa-sign-out txt-color-orangeDark\'></i>Success',
          content : "Account creation succeeded.",
          buttons : '[OK]'
        }, (ButtonPressed) => {
          if (ButtonPressed == "OK") {
            this.router.navigateByUrl("/accounts");
          }
        }
      );
    },(error)=>{
      this.notificationService.smartMessageBox(
        {
          title : '<i class=\'fa fa-sign-out txt-color-orangeDark\'></i>Error<span class=\'txt-color-orangeDark\'>' +
            '<strong>' + $('#show-shortcut').text() + '</strong></span>',
          content : "Account creation failed. The server returned an error (" + error + ")",
          buttons : '[OK]'
        }
      );
    });
  }

}
