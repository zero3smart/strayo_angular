import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { List } from 'immutable';

import { Observable } from 'rxjs/Observable';
import { switchMap, map, tap, share } from 'rxjs/operators';

import { SitesService } from '../../sites/sites.service';
import { DatasetsService } from '../../datasets/datasets.service';

import { Site } from '../../models/site.model';
import { Dataset } from '../../models/dataset.model';

@Component({
  selector: 'app-sitelayout',
  templateUrl: './sitelayout.component.html',
  styleUrls: ['./sitelayout.component.css'],
})
export class SiteLayoutComponent implements OnInit {
  site$: Observable<Site>;
  datasets$: Observable<List<Dataset>>;
  constructor(private sitesService: SitesService, private datasetsService: DatasetsService, private route: ActivatedRoute) {}

  ngOnInit() {
    console.log('service', this.datasetsService);
    if (!this.sitesService.initialized) {
      this.sitesService.init();
    }
    this.site$ = this.route.params.pipe(
      switchMap((params) => {
        const id = +params.id;
        // console.log('id', id);
        return this.sitesService.sitesState$.pipe(
          // tap(state => console.log('sites', state.sites.toJS().find(site => site.id() === id))),
          // tap(state => console.log('props', state.sites.map(site => site.getProperties()).toJS())),
          // tap(state => console.log('found', state.sites.find(site => site.id() === id))),
          map(state => state.sites.find(site => +site.id() === +id)),
          share(),
        );
      })
    );

    this.site$.subscribe(
      (site) => {
        // this.site = site;
        if (!site) return;
        this.datasetsService.setDatasets(site.datasets() || []);
      }
    );

    // this.datasets$ = Observable.create((o) => o.next([new Dataset()]));
    this.datasets$ = this.datasetsService.getState$().pipe(
      map((state) => state.datasets)
    );
  }

}
