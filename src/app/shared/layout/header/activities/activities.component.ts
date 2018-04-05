import { Component, OnInit, ElementRef, Renderer, OnDestroy } from '@angular/core';
import { ActivitiesService } from "./activities.service";
import { GoogleService } from "app/+outlook/shared/google.service";
import { Activity, Data } from "app/shared/layout/header/activities/shared/activities.model";
declare var $: any;
@Component({
  selector: 'sa-activities',
  templateUrl: './activities.component.html',
  providers: [ActivitiesService],
})
export class ActivitiesComponent implements OnInit, OnDestroy {
  count: number;
  lastUpdate: any;
  active: boolean;
  activities: Array<Activity> = [];
  activity: Data = new Data();
  activityData: Activity = new Activity();
  currentActivity: any;
  loading: boolean;

  constructor(
    private el: ElementRef,
    private renderer: Renderer,
    private activitiesService: ActivitiesService,
    private googleService: GoogleService
  ) {
    this.active = false;
    this.loading = false;
    this.count = 0;
    this.lastUpdate = new Date();
  }

  ngOnInit() {
    this.currentActivity = [];
    this.activities.push(this.activityData);
    this.googleService.clearOldUnreadMessages.subscribe(notify => {
      this.activities[0].data = [];
    })
    this.googleService.notificationMessage.subscribe(messages => {
      messages.forEach(element => {
        this.activity = new Data();
        this.activity.id = element.id;
        this.activity.title = this.getHeader(element.payload.headers, 'From');
        const number = (this.activity.title.match(/</g) || []).length;
        this.activity.title = number > 0 ? this.activity.title.substr(0, this.activity.title.indexOf('<')) : this.activity.title;
        this.activity.title = this.activity.title.replace(/(^"|"$)/g, '');
        this.activity.time = element.internalDate;
        this.activity.subject = this.getHeader(element.payload.headers, 'Subject');
        this.activity.message = element.snippet;
        this.activity.type = 'message';
        this.activities[0].data.splice(this.activities[0].data.length, 0, this.activity);
      });
      this.activities[0].title = "message";
      this.count = this.activities[0].data.length;
      this.currentActivity = this.activities[0];
    })
  }

  setActivity(activity) {
    this.currentActivity = activity;
  }

  private documentSub: any;
  onToggle() {
    let dropdown = $('.ajax-dropdown', this.el.nativeElement);
    this.active = !this.active;
    if (this.active) {
      dropdown.fadeIn()


      this.documentSub = this.renderer.listenGlobal('document', 'mouseup', (event) => {
        if (!this.el.nativeElement.contains(event.target)) {
          dropdown.fadeOut();
          this.active = false;
          this.documentUnsub()
        }
      });


    } else {
      dropdown.fadeOut()

      this.documentUnsub()
    }
  }

  getHeader(headers, index) {
    var header = '';
    headers.forEach(element => {
      if (element.name === index) {
        header = element.value;
      }
    });
    return header;
  }



  update() {
    this.loading = true;
    setTimeout(() => {
      this.lastUpdate = new Date()
      this.loading = false
    }, 2000)
  }


  ngOnDestroy() {
    this.documentUnsub()
  }

  documentUnsub() {
    this.documentSub && this.documentSub();
    this.documentSub = null
  }

}
