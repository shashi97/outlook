import { Component, OnInit, NgZone, ChangeDetectorRef, ChangeDetectionStrategy, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OutlookMessage } from '../shared/outlook-message.class';
import { OutlookService } from '../shared/outlook.service';
import { GoogleService } from '../shared/google.service';
import { CommonModel } from '../shared/common.model';
import { FadeInLeft } from '../../shared/animations/fade-in-left.decorator';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
declare var $: any;
@FadeInLeft()
@Component({
  selector: 'sa-compose',
  templateUrl: './compose.component.html',
})
export class ComposeComponent implements OnInit {
  public commonModel: CommonModel = new CommonModel();
  public message: OutlookMessage;
  public carbonCopy: boolean = false;
  public blindCarbonCopy: boolean = false;
  public attachments: boolean = false;
  public messageId: string = ''
  public isShowGmailLoginPage: boolean = false;
  private base64textString: String = '';

  constructor(private route: ActivatedRoute,
    private router: Router,
    private service: OutlookService,
    private googleService: GoogleService,
    public zone: NgZone,
    private ref: ChangeDetectorRef,
    public toastr: ToastsManager,
    vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.messageId = this.route.snapshot.params['id'] || '';
    this.getMessageByMessageId(this.messageId);

  }

  getMessageByMessageId(messageId) {
    this.googleService.getMessageByMessageId('me', messageId).subscribe((message: any) => {

      if (message.code === 401) {
        this.isShowGmailLoginPage = !this.isShowGmailLoginPage;
      } else {

        if (this.messageId !== '') {
          this.commonModel.sender = this.getHeader(message.payload.headers, 'From');
          const number = (this.commonModel.sender.match(/</g) || []).length;
          const senderEmail = number > 0 ?
            this.commonModel.sender.substring(this.commonModel.sender.lastIndexOf('<') + 1,
              this.commonModel.sender.lastIndexOf('>')) : this.commonModel.sender;
          const emailBody = this.getBody(message.payload);
          this.zone.run(() => this.commonModel.emailText = emailBody
          )
          if (!this.ref['destroyed']) {
            this.ref.detectChanges();
          }
        }

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
        setTimeout(() => {
          this.toastr.success('Message sent successfully!', 'Success!');
        }, 100);
      })
    } else {
      Object.keys(header).forEach((key) => (header[key] == null) && delete header[key]);
      this.googleService.sendMessage(header, this.commonModel.emailText).subscribe((res: any) => {
        if (res.message) {
          this.toastr.warning('Invalid Email Id ', 'Alert!');
          return;
        }
        setTimeout(() => {
          this.toastr.success('Message sent successfully!', 'Success!');

        }, 100);
        if (this.messageId === '') {
          this.router.navigate(['outlook/INBOX'])
        } else {
          this.router.navigate(['outlook/DRAFT']);
        }
        if (!this.ref['destroyed']) {
          this.ref.detectChanges();
        }
      })
    }

  }

  draft(isDraft) {
    const sender = this.commonModel.toValues.length > 0 ? this.commonModel.toValues.toString().replace(',', ';') : '';
    const Cc = this.commonModel.ccValues.length > 0 ? this.commonModel.ccValues.toString().replace(',', ';') : '';
    const Bcc = this.commonModel.bccValues.length > 0 ? this.commonModel.bccValues.toString().replace(',', ';') : '';
    const header = {
      'To': sender,
      'Cc': Cc,
      'Bcc': Bcc,
      'Subject': this.commonModel.subject
    }
    if (this.messageId === '') {
      this.googleService.createDraft('me', this.commonModel.emailText).subscribe((res: any) => {
        setTimeout(() => {
          this.toastr.success('Message sent to draft!', 'Success!');
        }, 100);
        this.router.navigate(['outlook/DRAFT']);
        if (!this.ref['destroyed']) {
          this.ref.detectChanges();
        }
      })
    } else {
      this.googleService.updateDraft('me', this.messageId, this.commonModel.emailText,
        this.commonModel.attachments, header).subscribe((res) => {
          setTimeout(() => {
            this.toastr.success('Message sent to draft!', 'Success!');
          }, 100);
          this.router.navigate(['outlook/DRAFT']);
          if (!this.ref['destroyed']) {
            this.ref.detectChanges();
          }
        })
    }

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


  onSuccessSignIn(event) {
    this.isShowGmailLoginPage = false;
  }

  onChange(event) {
    this.commonModel.emailText = event;
  }
}
