import {
    Component, Inject, OnInit, ElementRef, ViewChild, AfterViewInit, Output, EventEmitter,
    Input
} from "@angular/core";
import {IUserMedia} from "../media/IUserMedia";
import {UserMediaLibraryService} from "../UserMediaLibraryService";

@Component({
    selector: 'media-library-list',
    templateUrl: './MediaLibraryList.component.html',
    styleUrls: ['./MediaLibraryList.component.scss']
})
export class MediaLibraryList implements OnInit, AfterViewInit{
    @Output() mediaSelected:EventEmitter<IUserMedia> = new EventEmitter<IUserMedia>();
    @ViewChild("userMediaList") userMediaList:ElementRef;

    @Input() public mode:string;

    public collection:IUserMedia[] = [];

    constructor(private userMediaLibraryService:UserMediaLibraryService){
    }

    public ngOnInit():void {
      /*
        this.userMediaLibraryService.getMediaAddedSubject().subscribe((userMedia:IUserMedia)=>{
            this.collection.push(userMedia);
            this.userMediaList.nativeElement.scrollTop = 1000000;
        });
        this.userMediaLibraryService.getMediaRemovedSubject().subscribe(id=>{
            this.collection = this.collection.filter(userMedia=>{
                return userMedia.getId()!=id;
            });
        });
        */

        this.userMediaLibraryService.getCollectionChangedSubject().subscribe(collection => {
            this.collection = collection;
            this.userMediaList.nativeElement.scrollTop = 0;
        })
    }

    public ngAfterViewInit():void {
    }

    public removeUserMedia(mediaId:number):void{
        this.userMediaLibraryService.removeMedia(mediaId);
    }
    public selectUserMedia(media:IUserMedia):void{
        this.mediaSelected.emit(media);
    }

    public insertUserMediaInto(media:IUserMedia):void{
        this.userMediaLibraryService.insertUserMediaInto(media);
    }

    private log(value:any, ...rest):void{
      console.log("[MediaLibraryList] ",value);
        //EventBus.dispatchEvent(AppEvent.SEND_LOG, {className:this.getClassName(), value:value, rest:rest});
    }

    private getClassName():string{
        return "MediaLibraryList";
    }
}
