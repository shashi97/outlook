import { Component, OnInit, ViewEncapsulation, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { JsonApiService } from "app/core/api/json-api.service";
import { DatatableComponent } from "@swimlane/ngx-datatable/release";
import { NotificationService } from 'app/shared/utils/notification.service';
import { DatePipe } from '@angular/common';
import { ValueTransformer } from '@angular/compiler/src/util';

declare var $: any;

class ShortDatePipe extends DatePipe {
  public transform(value): any {
    return super.transform(value, 'MM/dd/yyyy');
  }
}

@Component({
  selector: 'rmt-associates-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class IndexComponent implements OnInit {

  @ViewChild(DatatableComponent) table: DatatableComponent;

  constructor(
    private router:Router,
    private jsonApiService:JsonApiService,
    private notificationService: NotificationService,
    private route:ActivatedRoute
  ) { }

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

  agentCount = function(){
    let agentAccountIds: number[] = [];
    this.rows.forEach((row)=>{
      if(agentAccountIds.indexOf(row.agentAccountId) < 0){
        agentAccountIds.push(row.agentAccountId);
      }
    });
    return agentAccountIds.length;
  };

  url:string;

  ngOnInit() {
    let parameterSubscription = this.route.params.subscribe( (params) => {
      this.url = '/properties';
      if ( params['id'] ) {
        this.url = this.url + '/' + params['id'];
      } 
    });

    this.jsonApiService.fetch(this.url).subscribe(data=> {
      this.temp = [...data];
      this.rows = data;
      this.selected = [];
      this.loadingIndicator = false;
    });


  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    const temp = this.temp.filter(function(d) {
      return !val || ['address','city','state'].some((field: any)=>{
        return d[field].toLowerCase().indexOf(val) !== -1
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

 
  
  onClickCreate(event){
    this.router.navigateByUrl('/properties/create');
  }


  onSelect(event) {
    this.router.navigateByUrl('/properties/details/' + this.selected[0].id);
  }

  //onActivate(event) {}

}
