import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FadeInTop } from "../../shared/animations/fade-in-top.decorator";
import { NotificationService } from 'app/shared/utils/notification.service';
import { JsonApiService } from "../../core/api/json-api.service";

declare var $: any;

@FadeInTop()
@Component({
  selector: 'rmt-property-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  public address: string;
  public city: string;
  public state: string = 'NJ';
  public zipCode: string;
  public floorCount: number;
  public bedroomCount: number;
  public bathroomCount: number;
  public hasBasement: boolean = false;
  public hasAttic: boolean = false;
  public hasGarage: boolean = false;
  public tagLine: string;
  public featureLine: string;
  public summary: string;

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
      floorCount: { required: true },
      bedroomCount: { required: true },
      bathroomCount: { required: true },
      tagLine: { required: true },
      featureLine: { required: true },
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
      floorCount: { required: 'required' },
      bedroomCount: { required: 'required' },
      bathroomCount: { required: 'required' },
      tagLine: {
        required: 'required',
        maxlength: '256 character maximum'
      },
      featureLine: {
        required: 'required',
        maxlength: '256 character maximum'
      },
      summary: { required: 'required' }
    }
  };

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private jsonApiService: JsonApiService) {}



  ngOnInit() {
  }

  onSubmit(){
    this.createProperty();
  }

  onClickCancel(event){
    this.router.navigateByUrl("/properties");
  }

  createProperty(){
    this.jsonApiService.post('/properties', {
      address: this.address,
      city: this.city,
      state: this.state,
      zipCode: this.zipCode,
      floorCount: this.floorCount,
      bedroomCount: this.bedroomCount,
      bathroomCount: this.bathroomCount,
      hasBasement: this.hasBasement,
      hasAttic: this.hasAttic,
      hasGarage: this.hasGarage,
      tagLine: this.tagLine,
      featureLine: this.featureLine,
      summary: this.summary
    }).subscribe(data=> {
      this.notificationService.smartMessageBox(
        {
          title : '<i class=\'fa fa-sign-out txt-color-orangeDark\'></i>Success',
          content : "Property creation succeeded.",
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
          content : "Property creation failed. The server returned an error (" + error + ")",
          buttons : '[OK]'
        }
      );
    });
  }

}
