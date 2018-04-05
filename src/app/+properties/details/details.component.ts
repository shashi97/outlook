import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FadeInTop } from "../../shared/animations/fade-in-top.decorator";
import { NotificationService } from 'app/shared/utils/notification.service';
import { JsonApiService } from "../../core/api/json-api.service";

declare var $: any;

@FadeInTop()
@Component({
  selector: 'rmt-property-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  public property:any = {};

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


  deleteProperty(id:number) {
    let confirmation: boolean = false;
    this.notificationService
    .smartMessageBox({
      title : '<i class=\'fa fa-sign-out txt-color-orangeDark\'></i>Confirm',
      content : "Are you sure you want to delete this property?",
      buttons : '[No][Yes]'
    },
    async (buttonPressed) => {
      if(buttonPressed == "Yes"){
        do {
          await new Promise(resolve => setTimeout(resolve, 100));
        } while ($("#MsgBoxBack").length);
       
        let deleteRequest = this.jsonApiService.delete('/properties/' + id)
        .subscribe(
          (data) => {
            this.notificationService
            .smartMessageBox({
              title : '<i class=\'fa fa-sign-out txt-color-orangeDark\'></i>Success',
              content : "Property deletion succeeded.",
              buttons : '[OK]'},
              (buttonPressed)=>{
                if ( buttonPressed == "OK") {
                  this.router.navigateByUrl('/properties');
                }
            });
          },
          (error) => {
            this.notificationService
            .smartMessageBox({
              title : '<i class=\'fa fa-sign-out txt-color-orangeDark\'></i>Error<span class=\'txt-color-orangeDark\'>',
              content : "Property deletion failed. The server returned an error.",
              buttons : '[OK]'
            });
          }
        );
      }
    });
  }


  onClickDelete(event){
      this.deleteProperty(this.property.id);
  }

  onClickCancel(event){
    this.router.navigateByUrl("/properties");
  }

  onClickEdit(event){
    this.router.navigateByUrl("/properties/edit/" + this.property.id);
  }

  onClickSchedule(event){
    this.router.navigateByUrl("/appointments/create/" + this.property.id);
  }

}
