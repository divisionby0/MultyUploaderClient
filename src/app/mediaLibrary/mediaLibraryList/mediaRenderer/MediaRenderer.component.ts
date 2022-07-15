import {Component, Input, OnDestroy, Output, EventEmitter, Inject, OnInit} from "@angular/core";
import {IUserMedia} from "../../media/IUserMedia";
import {Subject, Subscription, takeUntil} from "rxjs";
import {StringUtil} from "../../../utils/StringUtil";
import {DateUtils} from "../../../utils/DateUtils";

//import {IPurchaseExistenceDetector} from "../../mediaInfo/IPurchaseExistenceDetector";
@Component({
    selector: 'media-renderer',
    templateUrl: './MediaRenderer.component.html',
    styleUrls: ['./MediaRenderer.component.scss']
})
export class MediaRenderer implements OnInit, OnDestroy{
    @Output() insertInto:EventEmitter<IUserMedia> = new EventEmitter<IUserMedia>();
    @Output() remove:EventEmitter<number> = new EventEmitter<number>();
    @Output() selected:EventEmitter<IUserMedia> = new EventEmitter<IUserMedia>();

    private destroySubject$:Subject<void> = new Subject<void>();

    public uploadProgress:number = 0;

    public previewUrl:string = "";
    public stillImageUrl:string = "";
    public date:string;
    public durationString:string = "--";
    public state:string = "UPLOADING";
    public animatedPreviewVisible:boolean = false;
    public stillPreviewVisible:boolean = false;
    public totalPurchases:number = 0;
    public totalPreviewReviews:string = "0";
    public cost:number;
    public type:number = -1;

    private stateChangedSubscription:Subscription;
    private previewChangedSubscription:Subscription;
    private totalPurchasesChangedSubscription:Subscription;
    private _data:IUserMedia;

    private previewReviewsChangedSubscription:Subscription;

    private currentContactId:string;
    public currentContactName:string;

    public soldToCurrentContact:boolean = false;

    private currentContactChangedSubscription:Subscription;

    public wrapperCssClass:string = "";
    private selectedStateChangedSubscription:Subscription;

    get data():IUserMedia {
        return this._data;
    }
    @Input() set data(value:IUserMedia) {
        this._data = value;

        this.removePreviewChangedSubscription();

        if (this._data) {
          this._data.getUploadProgressSubject().pipe(
            takeUntil(this.destroySubject$)
          ).subscribe(progress => {
            this.uploadProgress = progress;
          });

            this.createStateChangedSubscription();

            this.state = this._data.getState();

            if(!this._data.getPreview()){
              this.createPreviewChangedSubscription();

              this.type = this._data.getType();

              this._data.getCostChangedSubject().pipe(
                takeUntil(this.destroySubject$)
              ).subscribe(cost => {
                console.log("cost changed "+cost);
                this.cost = cost;
              });

              if(this.type == 0){
                this._data.getDurationChangedSubject().pipe(
                  takeUntil(this.destroySubject$)
                ).subscribe(duration => {
                  this.durationString = StringUtil.toDuration(this._data.getDuration());
                });
              }
            }

            else{
                this.stillImageUrl = this._data.getStillImageUrl();
                this.previewUrl = this._data.getPreview();
                this.stillPreviewVisible = true;
                this.type = this._data.getType();
                this.cost = this._data.getCost();

                if(this.type == 0){
                    this.durationString = StringUtil.toDuration(this._data.getDuration());
                }

                this.parseDate();
            }

            this.totalPurchasesChangedSubscription = this._data.getTotalPurchasesChangedSubject().subscribe(totalPurchases=>{
                this.totalPurchases = totalPurchases;
            });

            this.previewReviewsChangedSubscription = this._data.getLeadsActionsChangedSubject().subscribe(data=>{
                 this.totalPreviewReviews = data.total.toString();
            });

            this.selectedStateChangedSubscription = this._data.getSelectedChangedSubject().subscribe(selected=>{
                this.onSelectedStateChanged();
            });

            this.totalPurchases = this._data.getTotalPurchases();

            this.onSelectedStateChanged();
        }
        else{
            this.log("set undefined data");
        }
    }

    constructor(){
    }

    public ngOnInit():void {

    }

    public ngOnDestroy():void {
        this.removePreviewChangedSubscription();
        this.removeStateChangedSubscription();

        if(this.currentContactChangedSubscription){
            this.currentContactChangedSubscription.unsubscribe();
            this.currentContactChangedSubscription = null;
        }
        if(this.selectedStateChangedSubscription){
            this.selectedStateChangedSubscription.unsubscribe();
            this.selectedStateChangedSubscription = null;
        }
        this.destroySubject$.next();
    }

    /*
    private updateCurrentContact():void{
        if(this.currentContactProvider.getSelectedContact()){
            this.currentContactId = this.currentContactProvider.getSelectedContact().getId().toString();
            this.currentContactName = this.currentContactProvider.getSelectedContact().name;
            this.updateSoldToCurrentContact();
        }
    }
     */

    public removeClicked(event:any):void{
        event.stopImmediatePropagation();
        event.stopPropagation();
        this.remove.emit(this._data.getId());
    }

    public clicked():void{
        this.selected.emit(this._data);
    }

    public copyClicked(event:any):void{
        event.stopImmediatePropagation();
        event.stopPropagation();

        //ClipboardUtil.copy(UserMediaInsertionCodeBuilder.build(this._data));
    }

    public insertClicked(event:any):void{
        event.stopImmediatePropagation();
        event.stopPropagation();

        this.insertInto.emit(this._data);
    }

    public onMouseOver():void{
        if(this.previewUrl){
            this.stillPreviewVisible = false;
            this.animatedPreviewVisible = true;
        }
    }

    public onMouseOut():void{
        if(this.stillImageUrl){
            this.stillPreviewVisible = true;
            this.animatedPreviewVisible = false;
        }
    }

    private createPreviewChangedSubscription():void{
        this.previewChangedSubscription = this._data.getPreviewChangedSubject().subscribe((previewUrl:string)=> {
            this.previewUrl = previewUrl;
            this.stillImageUrl = this._data.getStillImageUrl();
            this.stillPreviewVisible = true;
            this.durationString = StringUtil.toDuration(this._data.getDuration());
            this.parseDate();
            this.log("preview ready this.previewUrl="+this.previewUrl);
        });
    }

    private removePreviewChangedSubscription():void{
        if(this.previewChangedSubscription){
            this.previewChangedSubscription.unsubscribe();
            this.previewChangedSubscription = null;
        }
    }

    private createStateChangedSubscription():void{
        this.stateChangedSubscription = this._data.getStateChangedSubject().subscribe(state=>{
            this.state = state;
        })
    }

    private removeStateChangedSubscription():void{
        if(this.stateChangedSubscription){
            this.stateChangedSubscription.unsubscribe();
            this.stateChangedSubscription = null;
        }
    }

    private parseDate():void{
        if(this._data.getDate()){
            const offset:number = new Date().getTimezoneOffset();
            const ms:number = new Date(this._data.getDate()).getTime();

            const msWithOffset:number = ms - (offset * 60 * 1000);

            const dateWithOffset:Date = new Date(msWithOffset);
            const dateString:string = DateUtils.parseYearMonthDay(dateWithOffset);
            const timeString:string = DateUtils.parseHourMinute(dateWithOffset);
            this.date = "Создан " + dateString+" в "+timeString;
        }
    }

    private onSelectedStateChanged():void{
        if(this._data.isSelected()){
            this.wrapperCssClass = "selected";
        }
        else{
            this.wrapperCssClass = "";
        }
    }

    private log(value:any, ...rest):void{
      console.log("[MediaRenderer] ",value);
        //EventBus.dispatchEvent(AppEvent.SEND_LOG, {className:this.getClassName(), value:value, rest:rest});
    }

    private getClassName():string{
        return "MediaRenderer";
    }
}
