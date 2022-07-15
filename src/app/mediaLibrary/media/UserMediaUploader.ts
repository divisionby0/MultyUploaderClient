import {HttpClient, HttpEventType} from "@angular/common/http";
import {finalize, Observable, Subject, Subscription, takeUntil} from "rxjs";

export class UserMediaUploader{
  private http:HttpClient;
  private url:string;
  private data:any;
  private progress:number = 0;
  private progressSubject:Subject<number> = new Subject<number>();
  private completeSubject:Subject<any> = new Subject<any>();

  private cancelSubject$:Subject<void> = new Subject<void>();

  constructor(http:HttpClient, url:string, data:any) {
    this.http = http;
    this.url = url;
    this.data = data;
  }

  public start():void{
    const uploadSubject$:Observable<any> = this.http.post(this.url, this.data, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      finalize(() => {})
    );

    uploadSubject$.pipe(
      takeUntil(this.cancelSubject$)
    ).subscribe(event => {
      if (event.type == HttpEventType.UploadProgress) {
        this.progress = Math.round(100 * (event.loaded / event.total));
        this.progressSubject.next(this.progress);
      }
      else{
        if(event.body){
          const result:string = event.body.result;

          if(result == "OK"){
            const fileName:string = event.body;
            this.completeSubject.next(event.body);
          }
        }
      }
    });
  }

  public cancel():void{
    this.cancelSubject$.next();
  }
  public getProgressSubject():Subject<number>{
    return this.progressSubject;
  }
  public getCompleteSubject():Subject<any>{
    return this.completeSubject;
  }
}
