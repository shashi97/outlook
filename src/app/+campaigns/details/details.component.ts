import { Component, OnInit, ViewEncapsulation, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { JsonApiService } from "app/core/api/json-api.service";
import { DatatableComponent } from "@swimlane/ngx-datatable/release";
import { NotificationService } from 'app/shared/utils/notification.service';
import { ValueTransformer } from '@angular/compiler/src/util';
import { AuthService } from '../../+auth/auth.service';

declare var $: any;

@Component({
  selector: 'rmt-campaigns-index',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DetailsComponent implements OnInit {

  @ViewChild(DatatableComponent) table: DatatableComponent;

  constructor(
    private router:Router,
    private jsonApiService:JsonApiService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) { }

  user:any;
  campaign: any = { campaignName: "" };
    prospects: any[];

  rows = [];
  temp = [];
  selected = [];
  loadingIndicator: boolean = true;
  reorderable: boolean = true;
  pageSize: number = 10;
  controls: any = {
    pageSize:  10,
    filter: '',
  }

  ngOnInit() {
    this.user = this.authService.getClaims();
    let routeParameters = this.route.params;
  
    routeParameters.subscribe ((params) => {
      let id: number = +params['id'];
      this.loadCampaign(id);
    });
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter(function(d) {
      return !val || ['fullName','brokerageName'].some((field: any)=>{
        return d[field] ? d[field].toLowerCase().indexOf(val) !== -1 : false
      }) 
    });

    this.rows = temp;
    this.table.offset = 0;
  }

  updatePageSize(value) {
    if(!this.controls.filter){
      this.rows = [...this.temp];
      this.table.offset = 0;
    }

    this.controls.pageSize = parseInt(value)
    this.table.limit = this.controls.pageSize; 
    window.dispatchEvent(new Event('resize'));
  }

  onSelect(event) {
    this.router.navigateByUrl('/prospects/details/' + this.selected[0].id);
  }

  loadCampaign = (id: number) => {
    this.jsonApiService.fetch('/campaigns/' + id).subscribe(data=> {
      this.campaign = data;
      this.loadProspects(id)
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
  };

  loadProspects = (campaignId: number) => {
    this.jsonApiService.fetch('/prospects/campaign/' + campaignId).subscribe(data => {

      this.temp = [...data];
      this.rows = data;
      this.selected = [];
      this.loadingIndicator = false;

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
  };

}


