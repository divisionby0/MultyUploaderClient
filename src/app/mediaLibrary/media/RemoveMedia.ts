import {HttpClient} from "@angular/common/http";
import {Observable, Subscription} from "rxjs";
import {environment} from "../../../environments/environment";

export class RemoveMedia {

  readonly mediaId:number;
  private http:HttpClient;

  constructor(mediaId:number, http:HttpClient) {
    this.mediaId = mediaId;
    this.http = http;

    const subject$:Observable<any> = this.http.post(environment.removeUserMediaUrl, {mediaId:this.mediaId});

    const subscription:Subscription = subject$.subscribe(
      data => {
            console.log("remove media response: ",data);
            subscription.unsubscribe();
          },
      (error) => {
        console.error("remove media error: ", error);
        subscription.unsubscribe();
      },
      () => {
        subscription.unsubscribe();
      }
    );
  }
}
