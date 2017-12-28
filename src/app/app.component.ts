import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { map, tap } from 'rxjs/operators';

import { List } from 'immutable';

import { Site } from './models/site.model';
import { SitesState } from './sites/state';
import { SitesService } from './sites/sites.service';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  title = 'app';
  sites$: Observable<List<Site>>;
  constructor(private sitesService: SitesService) {
  }
  ngOnInit() {
    this.sitesService.init();
    this.sites$ = this.sitesService.sitesState$.pipe(
      tap(state => console.log('update', state)),
      map(state => state.sites)
    );
  }
}
