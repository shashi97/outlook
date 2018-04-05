import { Component, Renderer, OnInit, ViewChild, AfterViewInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { Outlook, Folder } from "./shared/outlook";
import { OutlookService } from "./shared/outlook.service";
import { FadeInTop } from "../shared/animations/fade-in-top.decorator";
import { GoogleService } from './shared/google.service'
import { NotificationService } from '../shared/utils/notification.service';
import { TitleCasePipe } from '@angular/common';
import { FolderComponent } from "app/+outlook/folder/folder.component";
// import { PageSize } from './shared/enum';
declare const gapi: any;
declare var $: any;
import * as _ from 'underscore';

@FadeInTop()
@Component({
  selector: 'sa-outlook',
  templateUrl: './outlook.component.html',

})
export class OutlookComponent implements OnInit, AfterViewInit, OnDestroy {
  outlook: Outlook;
  outlookSub: Subscription;
  isMoveToFolderShow: boolean = false;
  messagesTotal: number = 0;
  activeFolderKey: string;
  activeFolder: Folder;
  activeFolderSub: Subscription;
  isShowGmailLoginPage: boolean = false;
  isDisablePreviousButton: boolean = false;
  isDisableNextButton: boolean = false;
  firstPageValue: number = 1;
  lastPageValue: number = 30;
  // pager object
  pager: any = {};
  constructor(private route: ActivatedRoute,
    private router: Router,
    private outlookService: OutlookService, private googleService: GoogleService,
    private notificationService: NotificationService, private renderer: Renderer,
    private ref: ChangeDetectorRef) {
    this.outlook = new Outlook();
    this.activeFolder = new Folder();
    this.googleService.nextPageToken = []; //  refresh next page token on page load 


  }
  ngAfterViewInit() {

  }
  ngOnInit() {
    this.isDisablePreviousButton = !this.isDisableNextButton;
    this.googleService.googleInit();
    this.listOfAllLabels();
    this.getSelectedLabel();
    this.googleService.checkLogin.subscribe(login => {
      this.onSignIn(login);
    })

  }

  listOfAllLabels() {
    this.googleService.listOfAllLabels().subscribe(
      outlook => {
        if (outlook.code === 401) {
          this.isShowGmailLoginPage = !this.isShowGmailLoginPage;
        } else {
          this.outlook.folders = outlook;
          this.getlabelByLabelId('INBOX');
        }
        if (!this.ref['destroyed']) {
          this.ref.detectChanges();
        }
      }
    );
  }

  getlabelByLabelId(labelId) {
    this.googleService.labelByLabelId(labelId).subscribe((label) => {
      this.messagesTotal = label.messagesTotal;
        this.setPage(1, null);
        if (!this.ref['destroyed']) {
        this.ref.detectChanges();
      }
    })
  }
  getListByLabelId(labelId) {
    this.getlabelByLabelId(labelId);
    this.router.navigate(['outlook/' + labelId])
  }

  ngOnDestroy() {
    // this.outlookSub.unsubscribe();
    // this.activeFolderSub.unsubscribe();
  }

  getSelectedLabel() {
    this.activeFolderSub = this.googleService.activeFolder.subscribe(
      folder => {
        this.activeFolderKey = folder;

        if (this.outlook.folders) {
          this.activeFolder = this.outlook.folders.find(it => it.id == folder)
        }
        if (!this.ref['destroyed']) {
          this.ref.detectChanges();
        }
      }
    )

  }

  deleteSelected(action: string) {
    this.googleService.deleteSelected(action);
  }

  onSignIn(event) {
    this.isShowGmailLoginPage = false;
    this.listOfAllLabels();
    if (!this.ref['destroyed']) {
      this.ref.detectChanges();
    }
  }

  onFolderRefresh() {
    this.listOfAllLabels();
  }

  // onNextPageClick(isNextPage) {
  //   this.googleService.nextPage(isNextPage);
  // }

  setPage(page: number, isNextPage) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }

    // get pager object from service
    this.pager = this.getPager(this.messagesTotal, page);

    if (isNextPage !== null) {
      this.googleService.nextPage(isNextPage, page);
    }
  }

  getPager(totalItems: number, currentPage: number = 1, pageSize: number = 30) {
    // calculate total pages
    const totalPages = Math.ceil(totalItems / pageSize);

    let startPage: number, endPage: number;
    if (totalPages <= 30) {
      // less than 10 total pages so show all
      startPage = 1;
      endPage = totalPages;
    }

    // calculate start and end item indexes
    // const startIndex = (currentPage - 1) * pageSize;
    let startIndex = 1;
    if (currentPage > 1) {
      startIndex = (currentPage - 1) * pageSize + 1;
    }
    let endIndex = Math.min(currentPage * pageSize);
    if (totalPages === currentPage) {
      endIndex = totalItems
    }
    // create an array of pages to ng-repeat in the pager control
    const pages = _.range(startPage, endPage + 1);

    // return object with all pager properties required by the view
    return {
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages
    };
  }

}
