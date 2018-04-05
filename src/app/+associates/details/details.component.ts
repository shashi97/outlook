import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FadeInTop } from "../../shared/animations/fade-in-top.decorator";
import { NotificationService } from 'app/shared/utils/notification.service';
import { JsonApiService } from "../../core/api/json-api.service";
import { AuthService } from '../../+auth/auth.service';

declare var $: any;

@FadeInTop()
@Component({
  selector: 'rmt-associates-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  public user: any;

  public account:any = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private jsonApiService: JsonApiService,
    private authService: AuthService) {}

  ngOnInit() {

    this.user = this.authService.getClaims();

    let routeParameters = this.route.params;
    
    routeParameters.subscribe ((params) => {
      let id: number = +params['id'];
      this.jsonApiService.fetch('/associates/' + id).subscribe(data=> {
        this.account = data;
      }, error => {
        this.notificationService.smartMessageBox(
          {
            title : '<i class=\'fa fa-sign-out txt-color-orangeDark\'></i>Error<span class=\'txt-color-orangeDark\'>' +
              '<strong>' + $('#show-shortcut').text() + '</strong></span>',
            content : "Associate retrieval failed. The server returned an error (" + error + ")",
            buttons : '[OK]'
          }
        );
      });
    });
  }


  deactivateAssociate(id:number) {
    let confirmation: boolean = false;
    this.notificationService
    .smartMessageBox({
      title : '<i class=\'fa fa-sign-out txt-color-orangeDark\'></i>Confirm',
      content : "Are you sure you want to lock this associate's account?",
      buttons : '[No][Yes]'
    },
    async (buttonPressed) => {
      if(buttonPressed == "Yes"){
        do {
          await new Promise(resolve => setTimeout(resolve, 100));
        } while ($("#MsgBoxBack").length);
       
        let deleteRequest = this.jsonApiService.delete('/associates/' + id)
        .subscribe(
          (data) => {
            this.notificationService
            .smartMessageBox({
              title : '<i class=\'fa fa-sign-out txt-color-orangeDark\'></i>Success',
              content : "Associate account lock succeeded.",
              buttons : '[OK]'},
              (buttonPressed)=>{
                if ( buttonPressed == "OK") {
                  this.router.navigateByUrl('/associates');
                }
            });
          },
          (error) => {
            this.notificationService
            .smartMessageBox({
              title : '<i class=\'fa fa-sign-out txt-color-orangeDark\'></i>Error<span class=\'txt-color-orangeDark\'>',
              content : "Associate account lock failed. Please contact technical support.",
              buttons : '[OK]'
            });
          }
        );
      }
    });
  }


  editAccount(id:number){
    this.router.navigateByUrl('/associates/edit/' + id);
  }

  onClickDeactivate(event){
      this.deactivateAssociate(this.account.id);
  }

  onClickCancel(event){
    this.router.navigateByUrl("/associates");
  }

  onClickEdit(event){
    this.router.navigateByUrl("/associates/edit/" + this.account.id);
  }

}
