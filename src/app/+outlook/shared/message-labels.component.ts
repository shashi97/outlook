import {Component, OnInit, Input} from '@angular/core';


@Component({
  selector: 'message-labels',
  template: '<span *ngFor="let label of message.labelIds" class="label bg-color-{{LABELS[label]?.color}}">{{LABELS[label]?.name}}</span>',
})
export class MessageLabelsComponent implements OnInit {

  @Input() message:any;
  public LABELS = {
    INBOX: {
      name: "INBOX",
      color: "orange"
    },
    DRAFT: {
      name: "DRAFT",
      color: "teal"
    }
  };

  constructor() {
  }

  ngOnInit() {
    
  }

}
