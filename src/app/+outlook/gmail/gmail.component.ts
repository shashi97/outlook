import { Component, Renderer, OnInit, AfterViewInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { Outlook, Folder } from "./shared/outlook";
import { OutlookService } from "../shared/outlook.service";
import { FadeInTop } from "../shared/animations/fade-in-top.decorator";
import { GoogleService } from '../shared/google.service'
import { NotificationService } from '../../shared/utils/notification.service';
declare const gapi: any;
declare var $: any;

@Component({
  selector: 'sa-outlook-gmail',
  templateUrl: './gmail.component.html',
  styleUrls: ['./gmail.component.css']
})
export class GmailComponent implements OnInit, AfterViewInit, OnDestroy {

  outlookSub: Subscription;

  activeFolderKey: string;
  activeFolderSub: Subscription;
  @Output() onSuccessSignIn = new EventEmitter<boolean>();


  constructor(private route: ActivatedRoute,
    private router: Router,
    private outlookService: OutlookService, private googleService: GoogleService,
    private notificationService: NotificationService, private renderer: Renderer) {


  }
  ngAfterViewInit() {

  }




  ngOnInit() {
    var googleButton = document.getElementById('googleBtn');
    this.googleService.googleInit();

  }

  onSignIn() {
    var googleButton = document.getElementById('googleBtn');
    this.googleService.googleInit();
    // this.googleService.loadGapi(() => {
    //    // this.onSuccessSignIn.emit(true);
    // });
   
    // this.onSuccessSignIn.emit(true);
  }

  getListByLabelId(labelId) {
    this.router.navigate(['outlook/' + labelId])
  }

  ngOnDestroy() {
    // this.outlookSub.unsubscribe();
    // this.activeFolderSub.unsubscribe();
  }



}
