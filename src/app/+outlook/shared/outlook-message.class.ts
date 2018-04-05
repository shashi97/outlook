export interface Attachment {
  name:string
  picture:string
  size:number
}

export class Contact {
  picture:string
  email:string
  name:string
}

export class OutlookMessage {
  selected: boolean;
  id:string;
  contact:Contact = new Contact();
  read: boolean;
  subject:string;
  folder:string;
  date:string;
  body:string;
  attachments:Array<Attachment>;
  labels:Array<string>;

  // constructor(message: any){
  //   this.selected = false;
  //   this.id = message.id;
  //   this.contact = message.contact;
  //   this.read = message.read;
  //   // this.subject = message.subject;
  //   this.folder = message.folder;
  //   this.date = message.internalDate;
  //   this.body = message.payload.body;
  //   this.attachments = message.payload.parts;
  //   this.labels = message.labels;
  // }
  // public getBodyTeaser() {
  //   let clearBody = this.body.replace(/<[^<>]+?>/gm, ' ').replace(/(\s{2}|\n)/gm, ' ');

  //   let teaserMaxLength = 55 - this.subject.length;

  //   return clearBody.length > teaserMaxLength ? clearBody.substring(0, teaserMaxLength) + '...' : clearBody;
  // }

  // public hasAttachments() {
  //   return this.attachments && this.attachments.length
  // }

  // public fullAttachmentsTooltip() {
  //   return 'FILES: ' + this.attachments.map(it=> it.name).join(', ');
  // }

}
export class Message {
  selected: boolean;
  id:string;
  contact:Contact = new Contact();
  read: boolean;
  folder:string;
  date:string;
  subject: string = "";
  body:any;
  attachments:Array<Attachment> = [];
  labels:Array<string>;
}
export class subject {
  subject:string =""
} 