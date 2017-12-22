import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { Apollo, ApolloModule } from 'angular-apollo';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { Schema } from './schema';
import { API_URL } from '../util/getApiUrl';

@NgModule({
  exports: [
    HttpClientModule,
    ApolloModule,
    HttpLinkModule,
  ]
})
export class GraphQLModule {
  constructor(apollo: Apollo, httpLink: HttpLink) {
    const uri = API_URL;
    const http = httpLink.create({ uri });

    apollo.create({
      link: http,
      customResolvers: Schema,
      cache: new InMemoryCache(),
    });
  }
}
