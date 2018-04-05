import { Component, OnInit, OnDestroy, NgZone, ChangeDetectorRef, ViewContainerRef, ChangeDetectionStrategy } from '@angular/core';
import { Subscription } from "rxjs/Subscription";
import { ActivatedRoute, Router } from "@angular/router";
import { OutlookMessage } from "../shared/outlook-message.class";
import { OutlookService } from "../shared/outlook.service";
import { GoogleService } from '../shared/google.service';
import { CommonModel } from '../shared/common.model';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

declare var $: any;


@Component({
  selector: 'sa-replay',
  templateUrl: './replay.component.html',
  styleUrls: ['./reply.component.css']
})
export class ReplayComponent implements OnInit, OnDestroy {

  public message: OutlookMessage;
  public commonModel: CommonModel = new CommonModel();
  public replayTo: OutlookMessage;
  private replayToSub: Subscription;
  private paramsSub: Subscription;

  public carbonCopy: boolean = false;
  public blindCarbonCopy: boolean = false;
  public attachments: boolean = false;

  public sending: boolean = false;
  public messageId: string = ''
  constructor(private route: ActivatedRoute,
    private router: Router,
    private service: OutlookService,
    private googleService: GoogleService,
    public zone: NgZone,
    private ref: ChangeDetectorRef, public toastr: ToastsManager,
    vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
  }
  ngOnInit() {
    this.messageId = this.route.snapshot.params['id'] || '';
    const isFarward = this.route.routeConfig.path.indexOf('forward') !== -1;
    this.getMessageByMessageId(this.messageId, isFarward);
  }



  async getMessageByMessageId(Id, isFarward) {
    this.googleService.getMessageByMessageId('me', Id).subscribe(async (message: any) => {
      this.commonModel.internalDate = message.internalDate;
      this.commonModel.sender = message.payload.headers ? this.getHeader(message.payload.headers, 'From') : '';
      const number = (this.commonModel.sender.match(/</g) || []).length;
      const senderEmail = number > 0 ?
        this.commonModel.sender.substring(this.commonModel.sender.lastIndexOf('<') + 1,
          this.commonModel.sender.lastIndexOf('>')) : this.commonModel.sender;
      this.commonModel.subject = this.getHeader(message.payload.headers, 'Subject');
      this.commonModel.subject = isFarward ? 'Fwd:' + '' + this.commonModel.subject : 'Re:' + this.commonModel.subject
      if (!isFarward) {
        this.commonModel.toValues.push(senderEmail)
      }
      if (isFarward) {
        // const data = await  this.getMessageAttachment(message);
        this.commonModel.attachments = this.googleService.attachments;
      }
      const emailBody = this.getBody(message.payload);
      this.zone.run(() => this.commonModel.emailText = emailBody)
      if (!this.ref['destroyed']) {
        this.ref.detectChanges();
      }

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



  onAttachmentDownload(data, attachmentName) {
    const regex = /(?:\.([^.]+))?$/;
    const attachmentType = regex.exec(attachmentName)[1];
    var url = data.replace(/^data:image\/[^;]+/, 'data:application/octet-stream.' + attachmentType);
    window.open(url);
  }
  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const fileToLoad = event.target.files[0];
      const fileReader = new FileReader();
      fileReader.readAsDataURL(fileToLoad);
      fileReader.onload = (fileLoadedEvent: any) => {
        const data = fileLoadedEvent.target.result;
        for (const file of event.target.files) {
          const attachment = {
            'type': file.type,
            'attachmentId': '0',
            'size': file.size,
            'data': data,
            'name': file.name
          }
          this.commonModel.attachments.push(attachment);
        }
      };
    };


  }

  ngOnDestroy() {
    // this.replayToSub.unsubscribe();
    // this.paramsSub.unsubscribe()
  }

  send() {
    const sender = this.commonModel.toValues.length > 0 ? this.commonModel.toValues.toString().replace(',', ';') : '';
    const Cc = this.commonModel.ccValues.length > 0 ? this.commonModel.ccValues.toString().replace(',', ';') : '';
    const Bcc = this.commonModel.bccValues.length > 0 ? this.commonModel.bccValues.toString().replace(',', ';') : '';
    const header = {
      'To': sender,
      'Cc': Cc,
      'Bcc': Bcc,
      'Subject': this.commonModel.subject
    }
    if (this.commonModel.attachments.length > 0) {
      this.googleService.sendMessageWithAttachment(header, this.commonModel.emailText, this.commonModel.attachments).subscribe((res) => {

      })

    } else {
      Object.keys(header).forEach((key) => (header[key] == null) && delete header[key]); // removing null param from header

      this.googleService.sendMessage(header, this.commonModel.emailText).subscribe((res: any) => {
        if (res.message) {
          this.toastr.warning('Invalid Email Id ', 'Alert!');
          return;
        }
        setTimeout(() => {
          this.toastr.success('Message sent successfully!', 'Success!');

        }, 100);
      })
    }


  }

  draft(isDraft) {
    let email = $('<div/>').html(this.commonModel.emailText).text(); // encoding html to string
    this.googleService.createDraft('me', email).subscribe((res) => {
      setTimeout(() => {
        this.toastr.success('Message sent draft!', 'Success!');

      }, 100);
      if (!this.ref['destroyed']) {
        this.ref.detectChanges();
      }
    })

  }

  onChange(event) {
    let data = $('<div/>').html(event).text(); // encoding html to string
    this.commonModel.emailText = data;
  }

  onAttachmentDelete(attachment) {
    let index = this.commonModel.attachments.indexOf(attachment);
    this.commonModel.attachments.splice(index, 1);


  }
}
