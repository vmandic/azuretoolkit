import { AppCommonModule } from './common/appCommon.module';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './components/app/app.component';
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { HomeComponent } from './components/home/home.component';
import { FetchDataComponent } from './components/fetchdata/fetchdata.component';
import { SearchComponent } from './components/search/search.component';


@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        FetchDataComponent,
        HomeComponent,
        SearchComponent
    ],
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            { path: 'search', component: SearchComponent },
            { path: 'fetch-data', component: FetchDataComponent },
            { path: '**', redirectTo: 'home' }
        ]),
        AppCommonModule
    ]
})
export class AppModuleShared {
}
