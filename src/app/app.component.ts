import {Component,OnInit, ViewContainerRef} from '@angular/core';
import { GoogleService } from "app/+outlook/shared/google.service";
@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  public title = 'app works!';

  public constructor(private viewContainerRef: ViewContainerRef,
  public googleService:GoogleService) {}

  ngOnInit() {
    // setInterval(() => {
    //   this.googleService.listOfAllUnreadMessages().subscribe(data=>{
    //     // console.log(data);
    //   })
    // }, 3000);
  }

}
