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

  public account:any = {};

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

    let routeParameters = this.route.params;
    
    routeParameters.subscribe ((params) => {
      let id: number = +params['id'];
      this.jsonApiService.fetch('/associates/' + id).subscribe(data=> {
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
    this.router.navigateByUrl("/associates");
  }

  editAccount(){
    this.jsonApiService.put('/associates/' + this.account.id, {
      username: this.account.username,
      lastName: this.account.lastName,
      firstName: this.account.firstName,
      title: this.account.title,
      mobileNumber: this.account.mobileNumber,
      avatarUrl: this.account.avatarUrl,      
      isBroker: this.account.isBroker,
      isAgent: this.account.isAgent,
      isAssistant: this.account.isAssistant,
    }).subscribe(data=> {
      this.notificationService.smartMessageBox(
        {
          title : '<i class=\'fa fa-sign-out txt-color-orangeDark\'></i>Success',
          content : "Associate edit succeeded.",
          buttons : '[OK]'
        }, (ButtonPressed) => {
          if (ButtonPressed == "OK") {
            this.router.navigateByUrl("/associates");
          }
        }
      );
    },(error)=>{
      this.notificationService.smartMessageBox(
        {
          title : '<i class=\'fa fa-sign-out txt-color-orangeDark\'></i>Error<span class=\'txt-color-orangeDark\'>' +
            '<strong>' + $('#show-shortcut').text() + '</strong></span>',
          content : "Associate edit failed. The server returned an error (" + error + ")",
          buttons : '[OK]'
        }
      );
    });
  }

}
