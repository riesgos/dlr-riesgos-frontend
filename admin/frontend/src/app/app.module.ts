import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ClarityModule } from "@clr/angular";
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { CoreUiModule } from '@dlr-eoc/core-ui';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ClarityModule,
    AppRoutingModule,
    CoreUiModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
