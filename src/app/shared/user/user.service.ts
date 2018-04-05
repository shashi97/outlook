import {Injectable} from '@angular/core';


import {JsonApiService} from "../../core/api/json-api.service";
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class UserService {

  public user: Subject<any>;

  constructor(private jsonApiService:JsonApiService) {
    this.user = new Subject();
  }

  getLoginInfo():Observable<any> {
    return this.jsonApiService.fetch('/profiles')
      .do((user)=>{
        this.user.next(user)
    })
  }


}
