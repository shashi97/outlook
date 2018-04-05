import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, BaseRequestOptions, Response } from '@angular/http';
import { Outlook } from './outlook'
import { OutlookMessage } from './outlook-message.class';
import { JsonApiService } from '../../core/api/json-api.service';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
declare const gapi: any;
import { asObservable, OnInit } from './asObservable';
import { switchMap, mapTo } from 'rxjs/operators';
import { NotificationService } from '../../shared/utils/notification.service';
import { Base64 } from 'js-base64';
declare var $: any;

@Injectable()
export class GoogleService {
  private clientId: string = '527189971319-58qp3m7kv4iodngk6m3q1isch6cvtknq.apps.googleusercontent.com';
  public activeFolder: Subject<any>;
  public nextPageMessageList: Subject<any>;
  public notificationMessage: Subject<any>;
  public messages: Subject<any>;
  public checkLogin: Subject<any>;
  public clearOldUnreadMessages: Subject<any>;
  public nextPageToken: Array<any> = [];
  public accessToken: string = '';
  public attachments: Array<any> = [];
  public messageDetail: Subject<any>;
  private state = {
    lastFolder: '',
    messages: []
  };
  private scope = [
    'profile',
    'email',
    'https://mail.google.com/',
    'https://www.googleapis.com/auth/plus.me',

    'https://www.googleapis.com/auth/contacts.readonly',
    'https://www.googleapis.com/auth/admin.directory.user.readonly'
  ].join(' ');
  auth2: any;
  constructor(private notificationService: NotificationService) {
    this.activeFolder = new Subject();
    this.messages = new Subject();
    this.nextPageMessageList = new Subject();
    this.checkLogin = new Subject();
    this.notificationMessage = new Subject();
    this.clearOldUnreadMessages = new Subject();
    this.messageDetail = new Subject();
  }



  /**
   * Load Gmail API.
   *
   * @param  {Function} callback Function to call when the request is complete.
   */
  loadGapi(callback) {
    gapi.client.load('gmail', 'v1', callback);
  }
  /**
   * Fetch Label by LabelId.
   *
   * @param  {String} labelId ID of Label to get.
   * @param  {Function} callback Function to call when the request is complete.
   */
  labelByLabelId(labelId): Observable<any> {
    return new Observable(observer => {

      let request = gapi.client.gmail.users.labels.get({
        'userId': 'me',
        'id': labelId
      });
      request.execute((data) => {
        observer.next(data);
        this.activeFolder.next(labelId);
        observer.complete();
      });
    });
  }
  /**
  * Initializing gmail api variable and attaching it to a button.
  *
  */
  googleInit() {
    let div = document.getElementById('googleBtn');
    let that = this;
    gapi.load('auth2', () => {
      that.auth2 = gapi.auth2.init({
        client_id: that.clientId,
        cookiepolicy: 'single_host_origin',
        scope: that.scope
      });
      this.attachSignin(div);
    });
  }
  /**
   * Attaching element for login popup.
   *
  */
  attachSignin(element) {
    this.auth2.attachClickHandler(element, {},
      (googleUser) => {
        let profile = googleUser.getBasicProfile();
        this.accessToken = googleUser.getAuthResponse().access_token
        this.checkLogin.next();
        // this.listOfAllLabels();
      }, (error) => {
        console.log(JSON.stringify(error, undefined, 2));
      });
  }
  /**
      * Fetch messages in Labels by LabelIds.
      *
      * @param  {Array<String>} labelIds ID of Labels .
      * @param  {Number} maxCount messages in a page .
      * @param  {String} pageToken unique Id for page.
     */
  listOfAllMessages(labelIds, maxCount, pageToken): Observable<any> {
    let messageList: Array<any> = [];
    return new Observable(observer => {

      this.loadGapi(() => {

        let messageIds = gapi.client.gmail.users.messages.list({
          'userId': 'me',
          'labelIds': labelIds,
          'maxResults': maxCount,
          'pageToken': pageToken
        })
        messageIds.execute((resp) => {
          if (resp.error) {
            this.activeFolder.next(labelIds);
            observer.next(resp);
            observer.complete();
            return;
          }
          if (resp.messages && resp.messages.length > 0) {

            this.nextPageToken.indexOf(resp.nextPageToken) === -1 ? this.nextPageToken.push(resp.nextPageToken) : console.log('')

            resp.messages.forEach((messages) => {
              let messagesReq = gapi.client.gmail.users.messages.get({
                'userId': 'me',
                'id': messages.id
              });
              messagesReq.execute((data) => {
                messageList.push(data.result)
                if (messageList.length == resp.messages.length) {
                  observer.next(messageList);
                  this.state.messages = messageList;
                  observer.complete();
                  this.activeFolder.next(labelIds);
                }
              })
            });
          } else {
            observer.next(messageList);
            observer.complete();
          }
        });
      })

    });
  }
  /**
       * Fetch List of Labels (Folders) by user.
       *
      */
  listOfAllLabels(): Observable<any> {
    return new Observable(observer => {
      this.loadGapi(() => {
        const request = gapi.client.gmail.users.labels.list({ 'userId': 'me' })
        request.execute((resp) => {
          if (resp.error) {
            // this.handleError(resp.error)
            observer.next(resp);
            observer.complete();
          }
          observer.next(resp.labels);
          observer.complete();
        });
      })
    });
  }
  /**
       * modify message Labels to move them from one label to another.
       *
       * @param  {Array<String>} messageIds ID of messages to modify .
       * @param  {Array<String>} labelsToAdd ID of Labels to add from message.
       * @param  {Array<String>} labelsToRemove ID of Labels to remove from message .
      */
  modifyMessages(messageIds, labelsToAdd, labelsToRemove): Observable<any> {
    return new Observable(observer => {
      const message = gapi.client.gmail.users.messages.batchModify({
        'userId': 'me',
        'ids': messageIds,
        'addLabelIds': labelsToAdd,
        'removeLabelIds': labelsToRemove
      })
      message.execute((data) => {
        observer.next(data);
        observer.complete();
      }, (error) => {
        console.log(error);
      });
    })
  }

  modifyMessage(messageId, labelsToAdd, labelsToRemove): Observable<any> {
    return new Observable(observer => {
      const message = gapi.client.gmail.users.messages.modify({
        'userId': 'me',
        'id': messageId,
        'addLabelIds': labelsToAdd,
        'removeLabelIds': labelsToRemove
      })
      message.execute((data) => {
        observer.next(data);
        observer.complete();
      }, (error) => {
        console.log(error);
      });
    })
  }
  /**
   * Delete messages by messageIds.
   *
   * @param  {Array<String>} idsToDelete ID of messages to be deleted .
  */
  deleteMessages(idsToDelete): Observable<any> {
    return new Observable(observer => {
      const message = gapi.client.gmail.users.messages.delete({
        'userId': 'me',
        'ids': idsToDelete
      })
      message.execute((data) => {
        observer.next(data);
        observer.complete();
      });
    })

  }
  /**
      * Get message by messageId.
      *
      * @param  {String} userId ID of User (pass 'me' for logged in user) .
      * @param  {String} messageId ID of messages to be fetched .
     */
  getMessageByMessageId(userId, messageId) {
    return new Observable(observer => {
      this.loadGapi(() => {
        const message = gapi.client.gmail.users.messages.get({
          'userId': userId,
          'id': messageId,
        });

        message.execute((data) => {
          observer.next(data);
          observer.complete();
        });
      })
    })

  }
  /**
       * Sending Email message.
       *
       * @param  {object} headers_obj includes various headers like To,From,Cc, Subject etc.
       * @param  {String} message Message to be sent .
      */
  sendMessage(headers_obj, message) {
    return new Observable(observer => {
      let email = '';

      for (let header in headers_obj) {
        email += header += ": " + headers_obj[header] + "\r\n";
      }
      email += "\r\n" + message;

      var sendRequest = gapi.client.gmail.users.messages.send({
        'userId': 'me',
        'resource': {
          'raw': window.btoa(email).replace(/\+/g, '-').replace(/\//g, '_')
        }
      });
      sendRequest.execute((data) => {
        observer.next(data);
        observer.complete();
      });
    })
  }



  /**
 * Create Draft email.
 *
 * @param  {String} userId User's email address. The special value 'me'
 * can be used to indicate the authenticated user.
 * @param  {String} email RFC 5322 formatted String.
 */
  createDraft(userId, email) {
    return new Observable(observer => {
      const base64EncodedEmail = btoa(email);
      const request = gapi.client.gmail.users.drafts.create({
        'userId': userId,
        'resource': {
          'message': {
            'raw': base64EncodedEmail
          }
        }
      });
      request.execute((data) => {
        observer.next(data);
        observer.complete();
      });
    })

  }


  private handleError(error: any) {
    if (error.code === 401) {
      this.notificationService.smartMessageBox({
        title: "<i class='fa fa-sign-out txt-color-orangeDark'></i> Google SignIN <span class='txt-color-orangeDark'><strong>" + $('#show-shortcut').text() + "</strong></span>",
        content: "Please Sign In Gmail",
        buttons: '[cancel][Sign-In]'

      }, (ButtonPressed) => {
        if (ButtonPressed == "Sign-In") {
          document.getElementById('googleBtn').click();
        }
      });
    }

    // const errMsg = (error.message) ? error.message :
    //     error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    // // console.error(errMsg); // log to console instead
    // return Observable.throw('');
  }
  deleteSelected(action) {
    let data = {
      action: action,
      filterMessages: []
    }
    data.filterMessages = this.state.messages.filter((it) => it.selected);
    if (data.filterMessages.length > 0) {
      this.messages.next(data);
    } else {
      this.messageDetail.next(data);
    }
  }


  nextPage(isNextPage, page) {
    let token = ''
    if (this.nextPageToken.length - 1 === 0 && !isNextPage) {
      return;
    }
    if (isNextPage) {
      token = this.nextPageToken[this.nextPageToken.length - 1];
    } else {
      page = page - 2;
      token = this.nextPageToken[page];
      this.nextPageToken.splice(this.nextPageToken.length - 1, 1);

    }

    this.nextPageMessageList.next(token);
  }


  getAttachments(userId, message) {
    let attachmentList: Array<any> = [];

    return new Observable(observer => {

      const parts = message.payload.parts;
      if (parts) {
        for (let i = 0; i < parts.length; i++) {
          const part = parts[i];
          if ((part.body && part.body.attachmentId) || (part.body && part.body.data)) {
            let attachId: string;
            if (part.body.attachmentId) {
              attachId = part.body.attachmentId;
            } else {
              attachId = part.body.data;
            }
            const request = gapi.client.gmail.users.messages.attachments.get({
              'id': attachId,
              'messageId': message.id,
              'userId': userId
            });

            request.execute((attachment) => {
              if (attachment.result) {
                attachment.name = part.filename;
                attachment.result.data = attachment.result.data.replace(/ /g, '+');
                attachment.result.data = attachment.result.data.replace(/_/g, '/');
                attachment.result.data = attachment.result.data.replace(/-/g, '+');
                attachment.result.data = 'data:image/jpeg;base64,' + attachment.result.data;
                attachmentList.push(attachment)
                this.attachments = attachmentList;
                observer.next(attachmentList);
                // observer.complete();
              }
            });


          }
        }
      } else {
        observer.next(attachmentList);
        observer.complete();
      }


    })

  }


  /**
 * Replace Message within Draft with given ID.
 *
 * @param  {String} userId User's email address. The special value 'me'
 * can be used to indicate the authenticated user.
 * @param  {String} draftId ID of Draft to update.
 * @param  {String} updatedEmail RFC 5322 formatted String.
 * @param  {Boolean} send Send or not send Draft once updated.
 * @param  {Function} callback Function to call when the request is complete.
 */
  updateDraft(userId, draftId, updatedEmail, attachments, header) {
    return new Observable(observer => {

      const request = gapi.client.gmail.users.messages.delete({
        'userId': userId,
        'id': draftId
      });
      request.execute((resp) => {
        console.log(resp)
        const accessToken = this.accessToken;
        const nl = '\r\n';
        const boundary = 'foo_bar_baz';
        const sender = 'me';

        let message: any = [
          'Content-Type: multipart/mixed; boundary="foo_bar_baz"', '\r\n',
          'MIME-Version: 1.0', '\r\n',
          'From: ', sender, '\r\n',
          'To: ', header.To, '\r\n',
          'CC:', header.Cc, '\r\n',
          'Bcc:', header.Bcc, '\r\n',
          'Subject: ', header.Subject, '\r\n\r\n',

          '--' + boundary, '\r\n',
          'Content-Type: text/html; charset="UTF-8"', '\r\n',
          'MIME-Version: 1.0', '\r\n',
          'Content-Transfer-Encoding: 7bit', '\r\n\r\n',

          updatedEmail, '\r\n\r\n'

        ]

        for (var i = 0; i < attachments.length; i++) {

          const attachment = [
            '\r\n\r\n' + '--' + boundary,
            'Content-Type: ' + attachments[i].type,

            'Content-Transfer-Encoding: base64' + nl,
            'Content-Disposition: attachment; filename="' + attachments[i].name + '"',
            attachments[i].data.replace(/^data:image\/[a-z]+;base64,/, '')
          ];

          message.push(attachment.join(nl));

        }
        message.push('\r\n\r\n' + '--' + boundary + '--');
        message = message.join('');


        $.ajax({
          type: 'POST',
          url: 'https://www.googleapis.com/upload/gmail/v1/users/me/drafts?uploadType=multipart',
          headers: {
            Authorization: 'Bearer ' + accessToken
          },
          contentType: 'message/rfc822',
          data: message

        }).then((res) => {
          observer.next(res);
          observer.complete();
        })
      });

    })

  }
  sendMessageWithAttachment(header, email, attachments) {
    return new Observable(observer => {
      var accessToken = this.accessToken;
      var nl = "\r\n";
      var boundary = 'foo_bar_baz';
      var sender = 'me';
      var receiver = header.To;
      var Cc = header.Cc;
      var Bcc = header.Bcc;
      var subject = header.Subject;
      var messageText = 'This is the messsage text';

      let message: any = [
        'Content-Type: multipart/mixed; boundary="foo_bar_baz"', '\r\n',
        'MIME-Version: 1.0', '\r\n',
        'From: ', sender, '\r\n',
        'To: ', receiver, '\r\n',
        'CC:', Cc, '\r\n',
        'Bcc:', Bcc, '\r\n',
        'Subject: ', subject, '\r\n\r\n',

        '--' + boundary, '\r\n',
        'Content-Type: text/html; charset="UTF-8"', '\r\n',
        'MIME-Version: 1.0', '\r\n',
        'Content-Transfer-Encoding: 7bit', '\r\n\r\n',

        email, '\r\n\r\n'

      ]

      for (var i = 0; i < attachments.length; i++) {

        var attachment = [
          '\r\n\r\n' + "--" + boundary,
          "Content-Type: " + attachments[i].type,

          "Content-Transfer-Encoding: base64" + nl,
          'Content-Disposition: attachment; filename="' + attachments[i].name + '"',
          attachments[i].data.replace(/^data:image\/[a-z]+;base64,/, "")
        ];

        message.push(attachment.join(nl));

      }
      message.push('\r\n\r\n' + '--' + boundary + '--');
      message = message.join('');


      $.ajax({
        type: "POST",
        url: "https://www.googleapis.com/upload/gmail/v1/users/me/messages/send?uploadType=multipart",
        headers: {
          Authorization: 'Bearer ' + accessToken
        },
        contentType: "message/rfc822",
        data: message
      }).then((res) => {
        observer.next(res);
        observer.complete();
      })
    })


  }

  deleteMessageForever(messageId): Observable<any> {
    return new Observable(observer => {
      const message = gapi.client.gmail.users.messages.trash({
        'userId': 'me',
        'id': messageId,
      })
      message.execute((data) => {
        observer.next(data);
        observer.complete();
      }, (error) => {
        console.log(error);
      });
    })
  }


  listOfAllUnreadMessages(): Observable<any> {
    let labelIds = 'INBOX';
    let maxCount = 20;
    let pageToken = null;
    let messageList: Array<any> = [];
    return new Observable(observer => {

      this.loadGapi(() => {

        let messageIds = gapi.client.gmail.users.messages.list({
          'userId': 'me',
          'labelIds': labelIds,
          'maxResults': maxCount,
          'pageToken': pageToken,
          'q': 'is:unread'
        })
        messageIds.execute((resp) => {
          if (resp.error) {
            // this.activeFolder.next(labelIds);
            observer.next(resp);
            observer.complete();
            return;
          }
          if (resp.messages && resp.messages.length > 0) {
            resp.messages.forEach((messages) => {
              let messagesReq = gapi.client.gmail.users.messages.get({
                'userId': 'me',
                'id': messages.id
              });
              messagesReq.execute((data) => {
                messageList.push(data.result)
                if (messageList.length == resp.messages.length) {
                  this.clearOldUnreadMessages.next();
                  observer.next(messageList);
                  this.notificationMessage.next(messageList);
                  observer.complete();
                  // this.activeFolder.next(labelIds);
                }
              })
            });
          } else {
            observer.next(messageList);
            observer.complete();
          }
        });
      })

    });
  }

  modifyMessageAsRead(messageId) {
    const labelsToAdd = [];
    const labelsToRemove = ['unread'];
    return new Observable(observer => {
      const message = gapi.client.gmail.users.messages.modify({
        'userId': 'me',
        'id': messageId,
        'resource': {
          'addLabelIds': [],
          'removeLabelIds': ['UNREAD']
        }
      })
      message.execute((data) => {
        observer.next(data);
        observer.complete();
      }, (error) => {
        console.log(error);
      });
    })

  }



}
