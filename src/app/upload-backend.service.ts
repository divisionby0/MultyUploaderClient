import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {finalize, Observable} from "rxjs";
import {SmartUploadRequest} from "./SmartUploadRequest";

@Injectable({
  providedIn: 'root'
})
export class UploadBackendService {

  constructor(private http:HttpClient) {
  }

  public uploadVideo(url:string, data:any):Observable<any>{
    const request:SmartUploadRequest = new SmartUploadRequest(this.http);
    return request.upload(url, data);

    const uploadSubject$:Observable<any> = this.http.post(url, data, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      finalize(() => {

      })
    );


    return uploadSubject$;
    //return this.http.post(url, data);
  }

}
