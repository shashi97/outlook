import { Component, OnInit, ViewContainerRef, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { OutlookMessage, Message } from "../shared/outlook-message.class";
import { Subscription } from "rxjs/Subscription";
import { OutlookService } from "../shared/outlook.service";
import { GoogleService } from "../shared/google.service";
import { DatePipe } from '@angular/common';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import 'rxjs/Rx';
@Component({
  selector: 'sa-details',
  templateUrl: './details.component.html',

})
export class DetailsComponent implements OnInit {

  public message: Message = new Message();
  public messageSub: Subscription;
  public paramsSub: Subscription;
  public isShowGmailLoginPage: boolean = false;


  constructor(private route: ActivatedRoute,
    private router: Router,
    private service: OutlookService,
    private sanitizer: DomSanitizer,
    public googleService: GoogleService,
    private ref: ChangeDetectorRef,
    public toastr: ToastsManager,
    vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.paramsSub = this.route.params.subscribe((params) => {
      this.getMessageByMessageId(params['id']);
    });
    this.route.queryParams.subscribe((param) => {
      this.message.folder = param['Labels'];
    })
    this.messageSub = this.googleService.messageDetail.subscribe(message => {
      const labelsToAdd = [];
      const labelsToRemove = [];
      labelsToAdd.push(message.action);
      labelsToRemove.push(this.message.folder);
      this.googleService.modifyMessage(this.message.id, labelsToAdd, labelsToRemove).subscribe(result => {
        if (result.result) {
          this.toastr.success('The conversation has been moved to the Trash and will be permanently deleted in 30 days.', 'Success!');
          this.router.navigate(['outlook/' + this.message.folder]);
         
        }
      })

      // labelsToRemove.push(this.folderName);
      // moveToTrashMessage.forEach((it) => { messageIds.push(it.id) });
      // this.googleService.modifyMessages(messageIds, labelsToAdd, labelsToRemove).subscribe(messages => {
      //  if(messages.result) {
      //   this.toastr.success('Conversations have been moved to the Trash.', 'Success!');
      //   this.getAllMessageList(this.folderName);
      //  }
    });

  }

  getMessageByMessageId(Id) {
    this.googleService.getMessageByMessageId('me', Id).subscribe((message: any) => {
      if (message.code == 401) {
        this.isShowGmailLoginPage = !this.isShowGmailLoginPage;
        return
      }
      this.message.attachments = [];
      this.getMessageAttachment(message);
      this.message.id = message.id;
      this.message.subject = this.getHeader(message.payload.headers, 'Subject');

      if (this.message.folder === 'SENT') {
        this.message.contact.email = this.getHeader(message.payload.headers, 'To');
        this.message.contact.name = this.getHeader(message.payload.headers, 'From');
      } else {
        this.message.contact.email = this.getHeader(message.payload.headers, 'From');
        this.message.contact.name = this.getHeader(message.payload.headers, 'From');
        const number = (this.message.contact.email.match(/</g) || []).length;
        if (number > 0) {
          this.message.contact.name = this.message.contact.name.substr(0, this.message.contact.name.indexOf('<'))
          this.message.contact.email = this.message.contact.email.substring(this.message.contact.email.lastIndexOf("<")
            + 1, this.message.contact.email.lastIndexOf(">"));
        }
      }
      this.message.date = this.getHeader(message.payload.headers, 'Date');
      this.message.body = this.getBody(message.payload);
      this.message.body = this.sanitizer.bypassSecurityTrustHtml(this.message.body);
      if (!this.ref['destroyed']) {
        this.ref.detectChanges();
      }
      this.modifyMessageAsRead();
    })
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

  getMessageAttachment(message) {
    this.googleService.getAttachments('me', message).subscribe((attachment: any) => {
      this.message.attachments = attachment;     
      if (!this.ref['destroyed']) {
        this.ref.detectChanges();
      }
    });
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

  replyToMessage(messageId) {
    this.router.navigate(['outlook/reply/' + messageId]);
  }

  onSuccessSignIn(event) {
    this.isShowGmailLoginPage = false;
  }

  downloadFile(data, attachmentName) {
    const regex = /(?:\.([^.]+))?$/;
    const attachmentType = regex.exec(attachmentName)[1];
    var url = data.replace(/^data:image\/[^;]+/, 'data:application/octet-stream.' + attachmentType);
    window.open(url);
  }

  downloadAllAttachment() {
    this.message.attachments.forEach((item: any) => {
      var url = item.result.data.replace(/^data:image\/[^;]+/, 'data:application/octet-stream');
      window.open(url);
    })

  }

  ngOnDestroy() {
    this.messageSub.unsubscribe();
  }

  deleteMessageForever() {
    this.googleService.deleteMessageForever(this.message.id).subscribe(result => {
      if (result.result) {
        this.toastr.success('The conversation has been deleted!', 'Success!');
        this.router.navigate(['outlook/' + this.message.folder]);
      }
    })
  }

  markAsSpam(action) {
    const labelsToAdd = [];
    const labelsToRemove = [];
    labelsToAdd.push(action);
    labelsToRemove.push(this.message.folder);
    this.googleService.modifyMessage(this.message.id, labelsToAdd, labelsToRemove).subscribe(result => {
      if (result.result) {
        this.toastr.success('The conversation has been Marked as Spam', 'Success!');
        this.router.navigate(['outlook/' + this.message.folder]);
       
      }
    })
  }

   modifyMessageAsRead(){
     this.googleService.modifyMessageAsRead(this.message.id).subscribe(result=>{
      // console.log(result);
     })
   }
}


