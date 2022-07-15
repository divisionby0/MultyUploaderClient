import {interval, mergeMap, Observable, Subject, Subscription, takeUntil} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
export class DetectPreviewReady {
    readonly mediaId:number;
    private http:HttpClient;

    private readySubject$:Subject<any> = new Subject<any>();

    private cancelSubject$:Subject<void> = new Subject<void>();

    constructor(mediaId:number, http:HttpClient) {
        this.mediaId = mediaId;
        this.http = http;

        console.log("DetectPreviewReady this.mediaId="+this.mediaId);

      interval(1000).pipe(
        takeUntil(this.cancelSubject$),
        mergeMap(() => this.http.post(environment.detectPreviewReadyUrl, {mediaId:this.mediaId}))
      ).subscribe((data:any) => {
        if(data.result == "OK"){
          if(data.exists == true){
            this.cancelSubject$.next();

            const mediaData:any = data.media;
            this.readySubject$.next(mediaData);
          }
        }
      });
    }

    public getReadySubject():Subject<any>{
        return this.readySubject$;
    }

    public destroy():void{
      this.log("destroy");
      this.cancelSubject$.next();
    }

    private log(value:any, ...rest):void{
      console.log("[DetectPreviewReady] ",value);
        //EventBus.dispatchEvent(AppEvent.SEND_LOG, {className:this.getClassName(), value:value, rest:rest});
    }

    private getClassName():string{
        return "DetectPreviewReady";
    }
}
