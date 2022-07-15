import {UserMedia} from "./media/UserMedia";
import {Subject} from "rxjs";
import {Injectable} from "@angular/core";
import {IUserMedia} from "./media/IUserMedia";
import {MediaState} from "./media/MediaState";
import {environment} from "../../environments/environment";

@Injectable()
export class UserMediaLibraryService{
  private collection:UserMedia[] = [];

  private collectionChangedSubject:Subject<UserMedia[]> = new Subject<UserMedia[]>();

  constructor() {
    console.log("uploadVideoUrl="+environment.uploadVideoUrl);
  }

  public add(item:UserMedia):void{
    this.collection.push(item);
    this.collectionChangedSubject.next(this.collection);
  }

  public removeMedia(id:number):void{
    const media:UserMedia = this.getMediaById(id);
    console.log("removeMedia media=",media);
    if(media){
      media.remove();
      this.removeMediaById(id);
    }
  }

  public insertUserMediaInto(media:IUserMedia):void{
  }

  public getCollectionChangedSubject():Subject<UserMedia[]>{
    return this.collectionChangedSubject;
  }

  private getMediaById(id:number):UserMedia{
    const filtered:UserMedia[] = this.collection.filter(media => {
      return media.getId() == id;
    });

    if(filtered && filtered.length > 0){
      return filtered[0];
    }
    else{
      return null;
    }
  }

  private removeMediaById(id:number):void{
    const filtered:UserMedia[] = this.collection.filter(media => {
      return media.getId() !== id;
    });

    this.collection = filtered;
    this.collectionChangedSubject.next(this.collection);
  }
}
