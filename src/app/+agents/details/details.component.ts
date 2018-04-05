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
  selector: 'rmt-agent-details',
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

  public agent:any = {};


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
      this.jsonApiService.fetch('/agents/' + id).subscribe(data=> {

        this.agent = data;

        this.performancesTemp = [...data.performances];
        this.performancesRows = data.performances;
        this. populatePerformancesGraphData();



      }, error => {
        this.notificationService.smartMessageBox(
          {
            title : '<i class=\'fa fa-sign-out txt-color-orangeDark\'></i>Error<span class=\'txt-color-orangeDark\'>' +
              '<strong>' + $('#show-shortcut').text() + '</strong></span>',
            content : "Agent retrieval failed. The server returned an error (" + error + ")",
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

  editAgent(id:number){
    this.router.navigateByUrl('/agents/edit/' + id);
  }


  onClickCancel(event){
    this.router.navigateByUrl(this.caller);
  }

  onClickEdit(event){
    this.router.navigateByUrl("/agents/edit/" + this.agent.id);
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






}
