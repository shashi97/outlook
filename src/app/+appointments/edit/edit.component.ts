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

  public property:any = {};

  public validationOptions:any = {

    // Rules for form validation
    rules: {
      address: {
        required: true,
        maxlength: 256
      },
      city: {
        required: true,
        maxlength: 256
      },
      state: {
        required: true,
        maxlength: 2
      },
      zipCode: {
        required: true,
        maxlength: 12
      },
      totalRoomCount: { required: true },
      bedroomCount: { required: true },
      bathroomCount: { required: true },
      tagLine: { required: true },
      summary: { required: true }
    },

    // Messages for form validation
    messages: {
      address: {
        required: 'required',
        maxlength: '256 character maximum'
      },
      city: {
        required: 'required',
        maxlength: '256 character maximum'
      },
      state: {
        required: 'required',
        maxlength: '256 character maximum'
      },
      zipCode: {
        required: 'required',
        maxlength: '256 character maximum'
      },
      totalRoomCount: { required: 'required' },
      bedroomCount: { required: 'required' },
      bathroomCount: { required: 'required' },
      tagLine: {
        required: 'required',
        maxlength: '256 character maximum'
      },
      summary: { required: 'required' }
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
      this.jsonApiService.fetch('/properties/' + id).subscribe(data=> {
        this.property = data;
        this.property.password = "";
      }, error => {
        this.notificationService.smartMessageBox(
          {
            title : '<i class=\'fa fa-sign-out txt-color-orangeDark\'></i>Error<span class=\'txt-color-orangeDark\'>' +
              '<strong>' + $('#show-shortcut').text() + '</strong></span>',
            content : "Property retrieval failed. The server returned an error (" + error + ")",
            buttons : '[OK]'
          }
        );
      });
    });
  }

  onSubmit(){
    this.editProperty();
  }

  onClickCancel(event){
    this.router.navigateByUrl("/properties");
  }

  editProperty(){
    this.jsonApiService.put('/properties/' + this.property.id, {
      address: this.property.address,
      city: this.property.city,
      state: this.property.state,
      zipCode: this.property.zipCode,
      totalRoomCount: this.property.totalRoomCount,
      bedroomCount: this.property.bedroomCount,
      bathroomCount: this.property.bathroomCount,
      hasBasement: this.property.hasBasement,
      hasAttic: this.property.hasAttic,
      hasGarage: this.property.hasGarage,
      tagLine: this.property.tagLine,
      summary: this.property.summary,
      statusId: this.property.statusId
    }).subscribe(data=> {
      this.notificationService.smartMessageBox(
        {
          title : '<i class=\'fa fa-sign-out txt-color-orangeDark\'></i>Success',
          content : "Property edit succeeded.",
          buttons : '[OK]'
        }, (ButtonPressed) => {
          if (ButtonPressed == "OK") {
            this.router.navigateByUrl("/properties");
          }
        }
      );
    },(error)=>{
      this.notificationService.smartMessageBox(
        {
          title : '<i class=\'fa fa-sign-out txt-color-orangeDark\'></i>Error<span class=\'txt-color-orangeDark\'>' +
            '<strong>' + $('#show-shortcut').text() + '</strong></span>',
          content : "Property edit failed. The server returned an error (" + error + ")",
          buttons : '[OK]'
        }
      );
    });
  }

}
