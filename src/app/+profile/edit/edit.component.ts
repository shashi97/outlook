import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FadeInTop } from "../../shared/animations/fade-in-top.decorator";
import { NotificationService } from 'app/shared/utils/notification.service';
import { JsonApiService } from "../../core/api/json-api.service";

declare var $: any;

@FadeInTop()
@Component({
  selector: 'rmt-associates-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  public profile:any = {};

  public validationOptions:any = {

    // Rules for form validation
    rules: {
      emailAddress: {
        required: true,
        email: true
      },
      lastName: {
        maxlength: 256
      },
      firstName: {
        maxlength: 256
      },
      title: {
        maxlength: 256
      },
      mobileNumber: {
        maxlength: 256
      }
    },

    // Messages for form validation
    messages: {
      emailAddress: {
        required: 'Please enter an email address to be the account\'s username.',
        email: 'Please enter a VALID email address to be the account\'s username.'
      },
      lastName: {
        required: 'Please enter a last name for the associate.'
      },
      firstName: {
        required: 'Please enter a first name for the associate.'
      },
      title: {
        required: 'Please enter a title for the associate.'
      },
      mobile: {
        required: 'Please enter a mobile number for the associate.'
      }
    }
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private jsonApiService: JsonApiService) {}

  ngOnInit() {

    this.jsonApiService.fetch('/profiles').subscribe(data=> {
      this.profile = data;
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
  }

  onSubmit(){
    this.editProfile();
  }

  onClickCancel(event){
    this.router.navigateByUrl("/profile");
  }

  editProfile(){
    this.jsonApiService.put('/profiles', {
      username: this.profile.username,
      lastName: this.profile.lastName,
      firstName: this.profile.firstName,
      title: this.profile.title,
      mobileNumber: this.profile.mobileNumber,
      avatarUrl: this.profile.avatarUrl,
      summary: this.profile.summary
    }).subscribe(data=> {
      this.notificationService.smartMessageBox(
        {
          title : '<i class=\'fa fa-sign-out txt-color-orangeDark\'></i>Success',
          content : "Profile edit succeeded.",
          buttons : '[OK]'
        }, (ButtonPressed) => {
          if (ButtonPressed == "OK") {
            this.router.navigateByUrl("/profile");
          }
        }
      );
    },(error)=>{
      this.notificationService.smartMessageBox(
        {
          title : '<i class=\'fa fa-sign-out txt-color-orangeDark\'></i>Error<span class=\'txt-color-orangeDark\'>' +
            '<strong>' + $('#show-shortcut').text() + '</strong></span>',
          content : "Profile edit failed. The server returned an error (" + error + ")",
          buttons : '[OK]'
        }
      );
    });
  }

}
