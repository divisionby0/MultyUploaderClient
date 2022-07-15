import {Component, ElementRef, ViewChild} from '@angular/core';
import {finalize, Observable, Subscription} from "rxjs";
import {UploadBackendService} from "./upload-backend.service";
import {HttpClient, HttpEventType} from "@angular/common/http";
import {UserMedia} from "./mediaLibrary/media/UserMedia";
import {UserMediaLibraryService} from "./mediaLibrary/UserMediaLibraryService";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'multyUploaderClient';

  @ViewChild("fileInput") private fileInput:ElementRef;

  constructor(private http:HttpClient,
              private service:UserMediaLibraryService) {
  }

  public onSubmitVideo(event:any):void{
    console.log("onSubmitVideo()");
    const bitesInMegaBite:number = 1048576;
    const maxMegabites:number = 50;
    const MAX_IMAGE_SIZE:number = bitesInMegaBite * maxMegabites;// 50 MBites

    if (event.target.files && event.target.files[0]) {
      const file:any = event.target.files[0];
      if (file.size > MAX_IMAGE_SIZE) {
        alert("Нельзя загружать файлы объемом более "+maxMegabites + " мегабайтов");
        return;
      }
      else{
        this.uploadVideo(event.target.files[0]);

        if(this.fileInput){
          this.fileInput.nativeElement.value = null;
        }
      }
    }
    else{
      console.error("no files selected");
    }
  }

  // TODO https://blog.angular-university.io/angular-file-upload/
  public uploadVideo(file:File):void{
    console.log("uploadVideo file="+file);
    this.service.add(new UserMedia(file, 0, 0, "0", "", this.http));
  }
}
