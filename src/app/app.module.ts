import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql/graphql.module';

import { InMemoryDataService } from './mocks/inMemoryData.service';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers } from './reducers/index';
import { SitesEffects } from './sites/effects/sites.effects';
import { SitesService } from './sites/sites.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    GraphQLModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService),
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([SitesEffects]),
  ],
  providers: [SitesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
