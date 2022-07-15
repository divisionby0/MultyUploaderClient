import {HttpClient, HttpEventType} from "@angular/common/http";
import {finalize, Observable, Subject, Subscription} from "rxjs";

export class SmartUploadRequest{

  private uploadProgress:number;
  private uploadSub: Subscription;

  constructor(private http:HttpClient) {
  }

  public upload(url:string, data:any):Observable<any>{
    return Observable.create(observer => {
      const uploadSubject$:Observable<any> = this.http.post(url, data, {
        reportProgress: true,
        observe: 'events'
      }).pipe(
        finalize(() => this.reset())
      );

      this.uploadSub = uploadSubject$.subscribe(event => {
        if (event.type == HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round(100 * (event.loaded / event.total));
          //console.log("uploadProgress:"+this.uploadProgress);
        }
      })
    });
  }

  private reset():void{
    this.uploadProgress = null;
    this.uploadSub = null;
  }
}
