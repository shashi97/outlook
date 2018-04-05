import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FadeInTop } from "../../shared/animations/fade-in-top.decorator";
import { NotificationService } from 'app/shared/utils/notification.service';
import { JsonApiService } from "../../core/api/json-api.service";

declare var $: any;

@FadeInTop()
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  public account:any = {};

  public validationOptions:any = {

    // Rules for form validation
    rules: {
      emailAddress: {
        required: true,
        email: true
      },
      password: {
        minlength: 12,
        maxlength: 256
      },
      passwordConfirm: {
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
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private jsonApiService: JsonApiService) {}

  ngOnInit() {

    let routeParameters = this.route.params;
    
    routeParameters.subscribe ((params) => {
      let id: number = +params['id'];
      this.jsonApiService.fetch('/accounts/' + id).subscribe(data=> {
        this.account = data;
        this.account.password = "";
      }, error => {
        this.notificationService.smartMessageBox(
          {
            title : '<i class=\'fa fa-sign-out txt-color-orangeDark\'></i>Error<span class=\'txt-color-orangeDark\'>' +
              '<strong>' + $('#show-shortcut').text() + '</strong></span>',
            content : "Account retrieval failed. The server returned an error (" + error + ")",
            buttons : '[OK]'
          }
        );
      });
    });
  }

  onSubmit(){
    this.editAccount();
  }

  onClickCancel(event){
    this.router.navigateByUrl("/accounts");
  }

  editAccount(){
    this.jsonApiService.put('/accounts/' + this.account.id, {
      username: this.account.username,
      password: this.account.password,
      isAdministrator: this.account.isAdministrator,
      isCaptureTechnician: this.account.isCaptureTechnician,
      isContentTechnician: this.account.isContentTechnician,
      isActive: this.account.isActive,
      isVerified: this.account.isVerified,
      isLocked: this.account.isLocked
    }).subscribe(data=> {
      this.notificationService.smartMessageBox(
        {
          title : '<i class=\'fa fa-sign-out txt-color-orangeDark\'></i>Success',
          content : "Account edit succeeded.",
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
          content : "Account edit failed. The server returned an error (" + error + ")",
          buttons : '[OK]'
        }
      );
    });
  }

}
