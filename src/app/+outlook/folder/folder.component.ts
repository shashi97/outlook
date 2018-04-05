import { Component, OnInit, ViewContainerRef, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { OutlookMessage } from "../shared/outlook-message.class";
import { OutlookService } from "../shared/outlook.service";
import { GoogleService } from "../shared/google.service";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Subscription } from "rxjs/Subscription";
@Component({
  selector: 'sa-folder',
  templateUrl: './folder.component.html'
})
export class FolderComponent implements OnInit, OnDestroy {
  public messageSub: Subscription;
  private activeFolderSub: any;
  public folderName: string;
  public messages: Array<any>;
  public messageIndex:number = 0;
  public isShowGmailLoginPage: boolean = false;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private outlookService: OutlookService,
    public googleService: GoogleService,
    private ref: ChangeDetectorRef,
    public toastr: ToastsManager,
    vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {

    this.activeFolderSub = this.route.params.subscribe(params => {
      this.folderName = params['folder'];

      this.getAllMessageList(this.folderName, null);
      this.messageSub = this.googleService.messages.subscribe(message => {
      this.messageIndex = 0;
        const moveToTrashMessage = message.filterMessages;
        const messageIds = [];
        const labelsToAdd = [];
        const labelsToRemove = [];
        labelsToAdd.push(message.action);
        labelsToRemove.push(this.folderName);
        moveToTrashMessage.forEach((it) => { messageIds.push(it.id) });      
        if (messageIds && messageIds.length > 0) {
          this.googleService.modifyMessages(messageIds, labelsToAdd, labelsToRemove).subscribe(messages => {
            if (messages.result && this.messageIndex == 0) {              
              this.toastr.success('Conversations have been moved! ', 'Success!');
              this.getAllMessageList(this.folderName, null);
               this.messageIndex++;
            }
          });
        }
      }
      );
      // this.googleService.googleInit();
      // this.googleService.loadGapi(() => {
      //   this.getAllMessageList(folder);
      // });
    });
    this.googleService.nextPageMessageList.subscribe((token) => {
      this.getAllMessageList(this.folderName, token)
    })
  }

  getAllMessageList(folder, token) {
    this.googleService.listOfAllMessages(folder, 30, token).subscribe(messages => {
      if (messages.code == 401) {
        // this.router.navigate(['outlook/signin'])
        this.isShowGmailLoginPage = !this.isShowGmailLoginPage;
      } else {

        this.messages = messages;
        this.messages.forEach(item => {
          this.checkAttachmentsInList(item);
          item.subject = this.getHeader(item.payload.headers, 'Subject');
          item.name = this.folderName === 'SENT' ? this.getHeader(item.payload.headers, 'To') : this.getHeader(item.payload.headers, 'From');
          const number = (item.name.match(/</g) || []).length;
          item.name = number > 0 ? item.name.substr(0, item.name.indexOf('<')) : item.name;
          item.name = item.name.replace(/(^"|"$)/g, '');
          item.date = this.getHeader(item.payload.headers, 'Date');
          item.body = this.getBodyTeaser(item.snippet, item.subject);
        })
        if (!this.ref['destroyed']) {
          this.ref.detectChanges();
        }

      }
    });
  }

  public getBodyTeaser(body, subject) {
    let clearBody = body.replace(/<[^<>]+?>/gm, ' ').replace(/(\s{2}|\n)/gm, ' ');

    let teaserMaxLength = 55 - subject.length;

    return clearBody.length > teaserMaxLength ? clearBody.substring(0, teaserMaxLength) + '...' : clearBody;
  }

  getMessageByMessageId(Id) {
    if (this.folderName === 'DRAFT') {
      this.router.navigate(['outlook/compose/' + Id]);

    } else {
      this.router.navigate(['outlook/details/' + Id], {
        queryParams: { Labels: this.folderName }
      });

    }

  }

  ngOnDestroy() {
    this.messageSub.unsubscribe();
    this.activeFolderSub.unsubscribe();
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

  getBody(message) {
    var encodedBody = '';
    if (typeof message.parts === 'undefined') {
      encodedBody = message.body.data;
    }
    else {
      encodedBody = this.getHTMLPart(message.parts);
    }
    encodedBody = encodedBody.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '');
    return decodeURIComponent(encodeURI(window.atob(encodedBody)));
  }

  getHTMLPart(arr) {
    for (var x = 0; x <= arr.length; x++) {
      if (typeof arr[x].parts === 'undefined') {
        if (arr[x].mimeType === 'text/html') {
          return arr[x].body.data;
        }
      }
      else {
        return this.getHTMLPart(arr[x].parts);
      }
    }
    return '';
  }

  moveToTrashMessage() {
    this.messages.forEach(item => {
      console.log(item);
    })

  }

  checkAttachmentsInList(message) {
    const parts = message.payload.parts;
    if (parts) {
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (part.filename && part.filename.length > 0) {
          return message.hasAttachments = true;
        }
      }
    }
  }

  onSuccessSignIn(event) {
    this.isShowGmailLoginPage = false;
  }

}