import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Store } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';
import { tap, map } from 'rxjs/operators';

import { List } from 'immutable';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

import * as fromRoot from '../reducers';

import { ISite, Site } from '../models/site.model';
import { SitesState } from '../sites/state';
import * as sitesActions from './actions/actions';
import { GetSites } from './actions/actions';

const allSitesQuery = gql`{ sites { id, name, datasets { id } } }`;

@Injectable()
export class SitesService {
  public sitesState$: Observable<SitesState>;
  constructor(private store: Store<fromRoot.State>, private apollo: Apollo, private http: HttpClient) {
  }

  public init() {
    console.log('store', this.store);
    this.store.dispatch(new GetSites());
    this.sitesState$ = this.store.select('sites');
  }

  public getSites(): Observable<Site[]> {
    return this.apollo.watchQuery<{ sites: ISite[] }>({
      query: allSitesQuery,
    })
    .valueChanges
    .pipe(
      map(({ data }) => {
        return data.sites.map((site) => new Site(site));
      })
    );
  }
}
