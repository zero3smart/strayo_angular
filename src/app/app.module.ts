import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ApolloModule } from 'angular2-apollo';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql/graphql.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    GraphQLModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
