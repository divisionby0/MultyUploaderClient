import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {UserMediaUploader} from "./UserMediaUploader";
import {Subject, Subscription, takeUntil} from "rxjs";
import {IUserMedia} from "./IUserMedia";
import {MediaState} from "./MediaState";
import {DetectPreviewReady} from "../DetectPreviewReady";
import {RemoveMedia} from "./RemoveMedia";

export class UserMedia implements IUserMedia{
  readonly fileToUpload:File;
  private id:number;
  readonly type:number;
  private userId:string;
  protected url:string;

  private duration:number;
  private durationChangedSubject$:Subject<number> = new Subject<number>();

  private cost:number;
  private costChangedSubject$:Subject<number> = new Subject<number>();

  protected previewUrl:string;
  private previewChangedSubject$:Subject<string> = new Subject<string>();

  protected stillUrl:string;
  private httpClient:HttpClient;
  private uploader:UserMediaUploader;
  private uploadProgressSubject:Subject<number> = new Subject<number>();

  private state:string = MediaState.UPLOADING;

  private selected:boolean = false;
  private selectedChangedSubject:Subject<boolean> = new Subject<boolean>();

  private detectPreviewReady:DetectPreviewReady;

  private cancelUpload$:Subject<void> = new Subject<void>();
  private stateChangedSubject:Subject<string> = new Subject<string>();
  private destroySubject$:Subject<void> = new Subject<void>();

  constructor(fileToUpload:File, id:number, type:number, userId:string, url:string, httpClient:HttpClient) {
    this.fileToUpload = fileToUpload;

    if(!id){
      this.id = Math.round(Math.random() * 10000);
    }
    else{
      this.id = id;
    }

    this.type = type;
    this.userId = userId;
    this.url = environment.socketServerRestApi + "/" + url;
    this.httpClient = httpClient;

    this.upload();
  }

  public remove():void{
    this.log("remove() this.state = "+this.state);
    this.destroySubject$.next();

    switch(this.state){
      case MediaState.UPLOADING:
        this.uploader.cancel();
        this.cancelUpload$.next();
        break;

      case MediaState.BUILDING_PREVIEW:
        this.detectPreviewReady.destroy();
        break;
    }
    new RemoveMedia(this.id, this.httpClient);
  }

  public getId(): number {
    return this.id;
  }

  public getPreview(): string {
    return this.previewUrl;
  }
  public setPreviewUrl(previewUrl: string) {
    this.previewUrl = previewUrl;
    this.previewChangedSubject$.next(this.previewUrl);
  }
  public getPreviewChangedSubject(): Subject<string> {
    return this.previewChangedSubject$;
  }

  public getStillImageUrl(): string {
    return this.stillUrl;
  }

  public getCost(): number {
    return this.cost;
  }
  public getCostChangedSubject(): Subject<number> {
    return this.costChangedSubject$;
  }

  public getDate(): Date {
    return undefined;
  }

  public getDurationChangedSubject(): Subject<number> {
    return this.durationChangedSubject$;
  }

  public getDuration(): number {
    return this.duration;
  }

  public getType(): number {
    return this.type;
  }

  public getState(): string {
    return this.state;
  }

  public getTotalPurchases(): number {
    return 0;
  }

  public getSelectedChangedSubject(): Subject<boolean> {
    return this.selectedChangedSubject;
  }

  public isSelected(): boolean {
    return this.selected;
  }

  public getTotalPurchasesChangedSubject(): Subject<number> {
    return new Subject<number>();
  }

  public getStateChangedSubject(): Subject<string> {
    return this.stateChangedSubject;
  }

  public getLeadsActionsChangedSubject(): Subject<any> {
    return new Subject<any>();
  }

  public getUploadProgressSubject(): Subject<number> {
    return this.uploadProgressSubject;
  }

  private upload():void{
    this.log("start upload");
    const formData = new FormData();
    formData.append(this.type == 0 ? "video": "photo", this.fileToUpload, this.fileToUpload.name);
    formData.append("userId","123456789");
    formData.append("type", this.type.toString());

    this.uploader = new UserMediaUploader(this.httpClient, environment.uploadVideoUrl, formData);

    this.uploader.getCompleteSubject().pipe(
      takeUntil(this.cancelUpload$)
    ).subscribe((fileData) => {
      this.log("Upload complete fileData ", fileData);
      this.id = fileData.media.id;
      this.state = fileData.media.state;
      this.stateChangedSubject.next(this.state);
      this.onUploadComplete();
    });

    this.uploader.getProgressSubject().pipe(
      takeUntil(this.cancelUpload$)
    ).subscribe(progress => {
      this.uploadProgressSubject.next(progress);
    });

    this.uploader.start();
  }

  private onUploadComplete():void{
    this.detectPreviewReady = new DetectPreviewReady(this.id, this.httpClient);

    this.detectPreviewReady.getReadySubject().pipe(
      takeUntil(this.destroySubject$)
    ).subscribe(mediaData => {
      this.log("preview ready ",mediaData);
      this.state = "NORMAL";
      this.stillUrl = environment.socketServerRestApi + "/" + mediaData.stillUrl;
      this.previewUrl = environment.socketServerRestApi + "/" + mediaData.previewUrl;
      this.cost = mediaData.cost;
      this.duration = mediaData.duration;
      this.stateChangedSubject.next(this.state);
      this.costChangedSubject$.next(this.cost);
      this.durationChangedSubject$.next(this.duration);
    })
  }

  private log(value:any, ...rest):void{
    console.log(("[UserMedia]_"+this.id), value, rest);
  }
}
