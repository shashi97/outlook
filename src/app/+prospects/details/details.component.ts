import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FadeInTop } from "../../shared/animations/fade-in-top.decorator";
import { NotificationService } from 'app/shared/utils/notification.service';
import { JsonApiService } from "../../core/api/json-api.service";
import { DatatableComponent } from "@swimlane/ngx-datatable/release";
import { IMyDpOptions } from 'mydatepicker';


import * as moment from 'moment';

declare var $: any;

@FadeInTop()
@Component({
  selector: 'rmt-prospect-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DetailsComponent implements OnInit {

  @ViewChild(DatatableComponent) performancesTable: DatatableComponent;
  @ViewChild(DatatableComponent) activitiesTable: DatatableComponent;
 
  public myDatePickerOptions:IMyDpOptions = {
    inline: true
  }
  
 

  public caller: string;

  public prospect:any = {};
  public campaign:any = {};
  public agent:any = {};

  public activitiesRows:any[] = [];
  public activitiesTemp:any[] = [];
  public activitiesSelected:any[] = [];
  public activitesLoadingIndicator: boolean = true;
  public activitiesReorderable: boolean = true;
  public activitiesPageSize: number = 10;
  public activitiesControls: any = {
    pageSize:  10,
    filter: '',
  }

  public performancesRows:any[] = [];
  public performancesTemp:any[] = [];
  public performancesSelected:any[] = [];
  public performancesLoadingIndicator: boolean = true;
  public performancesReorderable: boolean = true;
  public performancesPageSize: number = 10;
  public performancesControls: any = {
    pageSize:  10,
    filter: '',
  }

  public performancesGraphData = [{data: []}]



  public typeEnum: number;
  public note: string;
  public nextContact: string;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private jsonApiService: JsonApiService) {}

  ngOnInit() {
    let routeParameters = this.route.params;
    routeParameters.subscribe ((params) => {
      let id: number = +params['id'];
      this.jsonApiService.fetch('/prospects/' + id).subscribe(data=> {

        this.prospect = data;

        this.performancesTemp = [...data.performances];
        this.performancesRows = data.performances;
        this. populatePerformancesGraphData();

        this.activitiesTemp = [...data.activities];
        this.activitiesRows = data.activities;

      }, error => {
        this.notificationService.smartMessageBox(
          {
            title : '<i class=\'fa fa-sign-out txt-color-orangeDark\'></i>Error<span class=\'txt-color-orangeDark\'>' +
              '<strong>' + $('#show-shortcut').text() + '</strong></span>',
            content : "Prospect retrieval failed. The server returned an error (" + error + ")",
            buttons : '[OK]'
          }
        );
      });
    });
  }

  populatePerformancesGraphData(){
    let performancesGraphData = [];
    this.performancesRows.slice(0,12).map((performancesRow)=>{
      performancesGraphData.push([
        moment((performancesRow.monthNumber + "/" + performancesRow.yearNumber),"M-YYYY").toDate(),
        performancesRow.soldValue
      ]);
    });
    this.performancesGraphData[0].data = performancesGraphData;
  }

  editProspect(id:number){
    this.router.navigateByUrl('/prospects/edit/' + id);
  }

  saveActivity(){
    this.jsonApiService.post('/activities', {
      prospectId: this.prospect.id,
      typeEnum: this.typeEnum,
      note: this.note,
      nextContact: this.nextContact
    }).subscribe( data => {
      this.activitiesRows.unshift(data);
    }, error => {
      this.notificationService.smartMessageBox(
        {
          title : '<i class=\'fa fa-sign-out txt-color-orangeDark\'></i>Error<span class=\'txt-color-orangeDark\'>' +
            '<strong>' + $('#show-shortcut').text() + '</strong></span>',
          content : "Prospect retrieval failed. The server returned an error (" + error + ")",
          buttons : '[OK]'
        }
      );
    });
  }

  onClickCancel(event){
    this.router.navigateByUrl(this.caller);
  }

  onClickEdit(event){
    this.router.navigateByUrl("/prospects/edit/" + this.prospect.id);
  }

  
  onClickSaveActivity(event){
    this.saveActivity();
  }

  onClickActivityTypeEnum(typeEnum){
    this.typeEnum = typeEnum;
  }

  onDateChanged(event: any){
    this.nextContact = event.formatted;
  }

  onSelectActivity(event:any){}

  updatePerformancesFilter(event) {
    const val = event.target.value;
    const temp = this.performancesTemp.filter(function(d) {
      return !val || ['yearNumber','monthNumber'].some((field: any)=>{
        return d[field] ? d[field] == val : false
      }) 
    });

    this.performancesRows = temp;
    this.performancesTable.offset = 0;
  }

  updatePerformancesPageSize(value) {
    if(!this.performancesControls.filter){
      this.performancesRows = [...this.performancesTemp];
      this.performancesTable.offset = 0;
    }

    this.performancesControls.pageSize = parseInt(value)
    this.performancesTable.limit = this.performancesControls.pageSize; 
    //window.dispatchEvent(new Event('resize'));
  }


  updateActivitiesFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.activitiesTemp.filter(function(d) {
      return !val || ['note'].some((field: any)=>{
        return d[field] ? d[field].toLowerCase().indexOf(val) !== -1 : false
      }) 
    });

    this.activitiesRows = temp;
    this.activitiesTable.offset = 0;
  }

  updateActivitiesPageSize(value) {
    if(!this.activitiesControls.filter){
      this.activitiesRows = [...this.activitiesTemp];
      this.activitiesTable.offset = 0;
    }

    this.activitiesControls.pageSize = parseInt(value)
    this.activitiesTable.limit = this.activitiesControls.pageSize; 
    //window.dispatchEvent(new Event('resize'));
  }


  public performancesGraphColors = {
    "chartBorderColor": "#efefef",
    "chartGridColor": "#DDD",
    "charMain": "#E24913",
    "chartSecond": "#6595b4",
    "chartThird": "#FF9F01",
    "chartFourth": "#7e9d3a",
    "chartFifth": "#BD362F",
    "chartMono": "#000"
  };

  public performancesGraphOptions = {
    series: {
      lines: {
        show: true
      },
      points: {
        show: true
      }
    },
    grid: {
      hoverable: true,
      clickable: true,
      tickColor: this.performancesGraphColors.chartBorderColor,
      borderWidth: 0,
      borderColor: this.performancesGraphColors.chartBorderColor
    },
    tooltip: true,
    tooltipOpts: {
      content: "Sales volume for <b>%x</b> was <span>$%y</span>",
      dateFormat: "%m/%Y",
      defaultTheme: false
    },
    colors: [this.performancesGraphColors.chartSecond, this.performancesGraphColors.chartFourth],
    yaxis: {

    },
    xaxis: {
      mode: "time",
      tickSize: [2, 'month']
    }
  };

  onClickRankDecrease(event){
    this.prospect.rank = Math.max(this.prospect.rank - 1, 1);
    this.updateProspect(this.prospect);
  }

  onClickRankIncrease(event){
    this.prospect.rank = Math.min(this.prospect.rank + 1, 10);
    this.updateProspect(this.prospect);
  }

  updateProspect(prospect:any){
    this.jsonApiService.put('/prospects/' + this.prospect.id, this.prospect).subscribe( data => {
      this.prospect.rank = data.rank;
      this.prospect.referralPersonId = data.referralPersonId;
      this.prospect.commissionPercentage = data.commissionPercentage;
      this.prospect.royaltyPercentage = data.royaltyPercentage;
      this.prospect.royaltyMaxUsd = data.royaltyMaxUsd;
      this.prospect.annualFeeUsd = data.annualFeeUsd;
      this.prospect.agencySplitPercentage = data.agencySplitPercentage;
      this.prospect.agencySplitMaxUsd = data.agencySplitMaxUsd;
    }, error => {
      this.notificationService.smartMessageBox(
        {
          title : '<i class=\'fa fa-sign-out txt-color-orangeDark\'></i>Error<span class=\'txt-color-orangeDark\'>' +
            '<strong>' + $('#show-shortcut').text() + '</strong></span>',
          content : "Prospect update failed. The server returned an error (" + error + ")",
          buttons : '[OK]'
        }
      );
    });
  }


}
