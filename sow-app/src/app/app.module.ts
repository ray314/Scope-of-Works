import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from "@angular/material/table";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RxReactiveFormsModule } from "@rxweb/reactive-form-validators";
import { NgxWebstorageModule } from 'ngx-webstorage';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ViewSummaryComponent } from './project-list/view.summary/view.summary.component';
import { SuccessComponent } from './success/success.component';
import { BusinessDefaultsComponent } from './summary/business-defaults/business-defaults.component';
import { DialogComponent } from './summary/dialog/dialog.component';
import { ProjectSettingsComponent } from './summary/project-settings/project-settings.component';
import { SummaryComponent } from './summary/summary.component';
import { WorkAreaBreakdownComponent } from './summary/work-area-breakdown/work-area-breakdown.component';
import { ZoneComponent } from './summary/zone/zone.component';
import { ZonesComponent } from './summary/zones/zones.component';
import { FilternumberDirective } from './_directives/filternumber.directive';
import { InvalidControlScrollDirective } from './_directives/invalidcontrolscroll.directive';
import { Interceptor } from './_http_interceptors/interceptor.service';
import { ToFormArray } from './_pipes';
import { AppService } from './_services';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ContactComponent,
    SummaryComponent,
    HomeComponent,
    BusinessDefaultsComponent,
    ProjectSettingsComponent,
    PageNotFoundComponent,
    ZoneComponent,
    ProjectListComponent,
    LoginComponent,
    SuccessComponent,
    ZonesComponent,
    WorkAreaBreakdownComponent,
    InvalidControlScrollDirective,
    FilternumberDirective,
    DialogComponent,
    ToFormArray,
    ViewSummaryComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatTableModule,
    MatButtonModule,
    HttpClientModule,
    NgxWebstorageModule.forRoot(),
    RxReactiveFormsModule
  ],
  providers: [AppService, ToFormArray, /*{
    provide: HTTP_INTERCEPTORS,
    useClass: Interceptor,
    multi: true,
  }*/],
  bootstrap: [AppComponent]
})
export class AppModule { }
