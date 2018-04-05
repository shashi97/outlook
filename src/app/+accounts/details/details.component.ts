import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FadeInTop } from "../../shared/animations/fade-in-top.decorator";
import { NotificationService } from 'app/shared/utils/notification.service';
import { JsonApiService } from "../../core/api/json-api.service";

declare var $: any;

@FadeInTop()
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  public account:any = {};

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


  deleteAccount(id:number) {
    let confirmation: boolean = false;
    this.notificationService
    .smartMessageBox({
      title : '<i class=\'fa fa-sign-out txt-color-orangeDark\'></i>Confirm',
      content : "Are you sure you want to delete this account?",
      buttons : '[No][Yes]'
    },
    async (buttonPressed) => {
      if(buttonPressed == "Yes"){
        do {
          await new Promise(resolve => setTimeout(resolve, 100));
        } while ($("#MsgBoxBack").length);
       
        let deleteRequest = this.jsonApiService.delete('/accounts/' + id)
        .subscribe(
          (data) => {
            this.notificationService
            .smartMessageBox({
              title : '<i class=\'fa fa-sign-out txt-color-orangeDark\'></i>Success',
              content : "Account deletion succeeded.",
              buttons : '[OK]'},
              (buttonPressed)=>{
                if ( buttonPressed == "OK") {
                  this.router.navigateByUrl('/accounts');
                }
            });
          },
          (error) => {
            this.notificationService
            .smartMessageBox({
              title : '<i class=\'fa fa-sign-out txt-color-orangeDark\'></i>Error<span class=\'txt-color-orangeDark\'>',
              content : "Account deletion failed. The server returned an error.",
              buttons : '[OK]'
            });
          }
        );
      }
    });
  }


  editAccount(id:number){
    this.router.navigateByUrl('/accounts/edit/' + id);
  }

  onClickDelete(event){
      this.deleteAccount(this.account.id);
  }

  onClickCancel(event){
    this.router.navigateByUrl("/accounts");
  }

  onClickEdit(event){
    this.router.navigateByUrl("/accounts/edit/" + this.account.id);
  }

}
