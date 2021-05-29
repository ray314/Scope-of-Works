import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent} from './page-not-found/page-not-found.component'
import { BusinessDefaultsComponent } from './summary/business-defaults/business-defaults.component';
import { ProjectSettingsComponent } from './summary/project-settings/project-settings.component';
import { ZoneComponent } from './summary/zone/zone.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { SuccessComponent } from './success/success.component';
import { ZonesComponent } from './summary/zones/zones.component';
import { WorkAreaBreakdownComponent } from './summary/work-area-breakdown/work-area-breakdown.component';
import { SummaryComponent } from './summary/summary.component';
import { AuthGuard } from './_helpers';
import { ZoneGuard } from './_helpers/load.zone.guard';
import { LoadWorkAreaGuard } from './_helpers/load.work.area.guard.service';
import { ViewSummaryComponent } from './project-list/view.summary/view.summary.component';
import { ViewSummaryGuard } from './_helpers/view.summary.guard.service';

// Routes to different components
const routes: Routes = [
    { path: '', redirectTo: "home", pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'project-list', component: ProjectListComponent},
    { path: 'home', component: HomeComponent },
    { path: 'viewExistingProjects', component: ProjectListComponent},
    { path: 'view-summary', component: ViewSummaryComponent, canActivate: [ViewSummaryGuard] },
    { path: 'businessDefaults', component: BusinessDefaultsComponent },
    { path: 'projectSettings', component: ProjectSettingsComponent },
    { path: 'zone/:id', component: ZoneComponent, canActivate: [ZoneGuard] },
    { path: 'zones', component: ZonesComponent },
    { path: 'work-breakdown-area', component: WorkAreaBreakdownComponent, canActivate: [LoadWorkAreaGuard]},
    { path: 'summary', component: SummaryComponent},
    { path: 'success', component: SuccessComponent },
    { path: '**', component: PageNotFoundComponent }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
