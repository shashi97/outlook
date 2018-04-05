import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {config} from '../../shared/smartadmin.config';
import {Observable} from 'rxjs/Observable';


@Injectable()
export class JsonApiService {

  constructor(private http: HttpClient) {}


  public fetch = this.get;

  public get(url, dataRequest?): Observable<any> {
      return this.http.get(config.API_URL + url, dataRequest)
      .map((dataResponse: any) => (dataResponse))
      // .catch(this.handleError)
  }

  public post(url, dataRequest): Observable<any> {
    
    return this.http.post(config.API_URL + url, dataRequest)
    .map((dataResponse: any) => (dataResponse))
    // .catch(this.handleError)
  }

  public put(url, dataRequest): Observable<any> {
    return this.http.put(config.API_URL + url, dataRequest)
    .map((dataResponse: any) => (dataResponse))
    // .catch(this.handleError)
  }

  public patch(url, dataRequest): Observable<any> {
    return this.http.patch(config.API_URL + url, dataRequest)
    .map((dataResponse: any) => (dataResponse))
    // .catch(this.handleError)
  }

  public delete(url): Observable<any> {
    return this.http.request('delete', config.API_URL + url)
    .map((dataResponse: any) => (dataResponse))
    // .catch(this.handleError)
  }

  private handleError(error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    // let errMsg = (error.message) ? error.message :
    //   error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    // // console.error(errMsg); // log to console instead
    // return Observable.throw('');
  }

}


