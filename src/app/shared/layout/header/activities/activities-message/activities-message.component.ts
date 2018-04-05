import {Component, OnInit, Input} from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
@Component({
  selector: '[activitiesMessage]',
  templateUrl: './activities-message.component.html',
})
export class ActivitiesMessageComponent implements OnInit {

  @Input()  item: any;
  constructor(
    private router: Router
  )
  {

  }

  ngOnInit() {
  }

  openListMessage(Id){
    this.router.navigate(['outlook/details/' + Id], {
      queryParams: { Labels: 'INBOX' }
    });
  }

}
