import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FadeInTop } from "../../shared/animations/fade-in-top.decorator";
import { NotificationService } from '../../shared/utils/notification.service';
import { JsonApiService } from "../../core/api/json-api.service";
import * as moment from 'moment'; 



declare var $: any;


const now = new Date();


@FadeInTop()
@Component({
  selector: 'rmt-property-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {


  model: NgbDateStruct;
  date: {year: number, month: number};

  // selectToday() {
  //   this.model = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
  // }




  public validationOptions:any = {

    // Rules for form validation
    rules: {
      x: {
        required: true,
        maxlength: 256
      }
    },

    // Messages for form validation
    messages: {
      x: {
        required: 'required',
        maxlength: '256 character maximum'
      }
    }
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private jsonApiService: JsonApiService) {}


    // minDate = new Date(2017, 5, 10);
    // maxDate = new Date(2018, 9, 15);
   
    // bsValue: Date = new Date();
    // bsRangeValue: any = [new Date(2017, 7, 4), new Date(2017, 7, 20)];




  public address: string;
  public city: string;
  public state: string;
  public username: string;
  public lastName: string;
  public firstName: string;
  public mobileNumber: string;
  public avatarUrl: string = '../../../assets/img/avatars/default-user-image.png';
  public durationInMinutes: string;
  public proposedAppointments: any[] = [];

  public constrainedEarliestAppointment: Date;
  public dayStartHour: number;
  public dayEndHour: number;

  public requestedEarliestDate: string;
  public requestedEarliestHour: string;

  private requestedEarliestAppointment = () => {
    return moment(this.requestedEarliestDate, "L")
      .hour(moment(this.requestedEarliestHour, "LT").hour())
      .minute(moment(this.requestedEarliestHour, "LT").minute())
      .toDate();
  };
  
  public propertyId: number;
  public proposal: any;
  public selectedAppointmentId: number;
  
  ngOnInit() {

    let routeParameters = this.route.params;
    
    routeParameters.subscribe ((params) => {
      this.propertyId = +params['propertyId'];
      this.retrieveAppointmentProposals();
    });

  }

  onSubmit(){
    

    this.jsonApiService.put('/appointments/schedule', {
      appointmentId: this.selectedAppointmentId
    }).subscribe(data=> {
      this.notificationService.smartMessageBox(
        {
          title : '<i class=\'fa fa-sign-out txt-color-orangeDark\'></i>Success',
          content : "Appointment scheduled.",
          buttons : '[OK]'
        }, (ButtonPressed) => {
          if (ButtonPressed == "OK") {
            this.router.navigateByUrl("/appointments");
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

  onClickCancel(event){
    this.router.navigateByUrl("/properties/details/" + this.propertyId);
  }

  scheduleAppointment(){
    this.jsonApiService.post('/appointments', {
      propertyId: this.propertyId
    }).subscribe(data=> {
      this.notificationService.smartMessageBox(
        {
          title : '<i class=\'fa fa-sign-out txt-color-orangeDark\'></i>Success',
          content : "Appointment scheduled.",
          buttons : '[OK]'
        }, (ButtonPressed) => {
          if (ButtonPressed == "OK") {
            this.router.navigateByUrl("/appointments");
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

  public onClickIncreaseDate(event): void {
    this.requestedEarliestDate = moment(this.requestedEarliestDate, 'L').add(1,"days").format('L');
    this.retrieveAppointmentProposals();

  }

  public onClickDecreaseDate(event): void {
    this.requestedEarliestDate = moment.max(
      moment(this.requestedEarliestDate, 'L').subtract(1,"days"),
      moment(this.constrainedEarliestAppointment)
    ).format('L');

    this.retrieveAppointmentProposals();

  }

  public onClickIncreaseHour(event): void {
        
    this.requestedEarliestHour = moment(this.requestedEarliestHour, 'LT').add(1,"hours").format('LT');
    if ( moment(this.requestedEarliestHour, 'LT').hour() > this.dayEndHour ){
      this.requestedEarliestHour = moment(this.requestedEarliestHour, 'LT').hour(this.dayEndHour).format('LT');
    }

    this.retrieveAppointmentProposals();

  }

  public onClickDecreaseHour(event): void {
    this.requestedEarliestHour = moment(this.requestedEarliestHour, 'LT').subtract(1,"hours").format('LT');
    
    if ( moment(this.requestedEarliestHour, 'LT').hour() < this.dayStartHour ){
      this.requestedEarliestHour = moment(this.requestedEarliestHour, 'LT').hour(this.dayStartHour).format('LT');
    }

    if (moment(this.requestedEarliestDate, "L").isSame(moment(this.constrainedEarliestAppointment), "day")) {
      this.requestedEarliestHour = moment.max(
        moment(this.requestedEarliestDate, "L").hour(moment(this.requestedEarliestHour, "LT").hour()).minute(moment(this.requestedEarliestHour, "LT").minute()),
        moment(this.constrainedEarliestAppointment)
      ).format('LT');
    }

    this.retrieveAppointmentProposals();
  }

  public onKeyPressHour(event): void {

    if ( event.keyCode === 13 ){
      this.requestedEarliestHour = moment(this.requestedEarliestHour, 'LT').format('LT');

      if ( moment(this.requestedEarliestHour, 'LT').hour() > this.dayEndHour ){
        this.requestedEarliestHour = moment(this.requestedEarliestHour, 'LT').hour(this.dayEndHour).format('LT');
      }
  
      if ( moment(this.requestedEarliestHour, 'LT').hour() < this.dayStartHour ){
        this.requestedEarliestHour = moment(this.requestedEarliestHour, 'LT').hour(this.dayStartHour).format('LT');
      }
  
      if (moment(this.requestedEarliestDate, "L").isSame(moment(this.constrainedEarliestAppointment), "day")) {
        this.requestedEarliestHour = moment.max(
          moment(this.requestedEarliestDate, "L").hour(moment(this.requestedEarliestHour, "LT").hour()).minute(moment(this.requestedEarliestHour, "LT").minute()),
          moment(this.constrainedEarliestAppointment)
        ).format('LT');
      }
  
      this.retrieveAppointmentProposals();
    }

  }


  public onKeyPressDate(event): void {

    if ( event.keyCode === 13 ){

      this.requestedEarliestDate = moment.max(
        moment(this.requestedEarliestDate, 'L'),
        moment(this.constrainedEarliestAppointment)
      ).format('L');
      this.retrieveAppointmentProposals();
    }

  }


  
  private retrieveAppointmentProposals(){
    this.jsonApiService
    .post('/appointments/propose',{
      propertyId: this.propertyId,
      from: this.requestedEarliestAppointment()
    })
    .subscribe(data=> {

      this.address = data.address;
      this.city = data.city;
      this.state = data.state;
      this.username = data.username;
      this.lastName = data.lastName;
      this.firstName = data.firstName;
      this.mobileNumber = data.mobileNumber;
      this.avatarUrl = data.avatarUrl;
      this.durationInMinutes = data.durationInMinutes;
      this.proposedAppointments = data.proposedAppointments;
      this.constrainedEarliestAppointment = data.constrainedEarliestAppointment;
      this.dayStartHour = data.dayStartHour;
      this.dayEndHour = data.dayEndHour;

      this.requestedEarliestDate = moment(this.proposedAppointments[0].scheduledStart).format('L');
      this.requestedEarliestHour = moment(this.proposedAppointments[0].scheduledStart).format('LT')

      this.selectedAppointmentId = this.proposedAppointments[0].id;

    }, error => {
      this.notificationService.smartMessageBox(
        {
          title : '<i class=\'fa fa-sign-out txt-color-orangeDark\'></i>Error<span class=\'txt-color-orangeDark\'>' +
            '<strong>' + $('#show-shortcut').text() + '</strong></span>',
          content : "Failed to retrieve candidate time slots for the appointment. The server returned an error (" + error + ")",
          buttons : '[OK]'
        }
      );
    });
  }

}
