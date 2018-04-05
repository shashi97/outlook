import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FadeInTop } from "../../shared/animations/fade-in-top.decorator";
import { NotificationService } from 'app/shared/utils/notification.service';
import { JsonApiService } from "../../core/api/json-api.service";

declare var $: any;

@FadeInTop()
@Component({
  selector: 'rmt-profile-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  public profile:any = {};

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
          content : "Profile retrieval failed. The server returned an error (" + error + ")",
          buttons : '[OK]'
        }
      );
    });
  }


  onClickEdit(event){
    this.router.navigateByUrl("/profile/edit");
  }

}


