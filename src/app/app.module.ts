import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {MediaLibraryList} from "./mediaLibrary/mediaLibraryList/MediaLibraryList.component";
import {UserMediaLibraryService} from "./mediaLibrary/UserMediaLibraryService";
import {MediaRenderer} from "./mediaLibrary/mediaLibraryList/mediaRenderer/MediaRenderer.component";

@NgModule({
  declarations: [
    AppComponent,
    MediaLibraryList,
    MediaRenderer
  ],
  imports: [
    HttpClientModule,
    BrowserModule
  ],
  providers: [
    HttpClient,
    UserMediaLibraryService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
