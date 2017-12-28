import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Site } from '../../models/site.model';
import { Dataset } from '../../models/dataset.model';
import { SitesService } from '../../sites/sites.service';
import { DatasetsService } from '../../datasets/datasets.service';

import { List } from 'immutable';

import { Observable } from 'rxjs/Observable';
import { switchMap, map, share, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-dataset-layout',
  templateUrl: './dataset-layout.component.html',
  styleUrls: ['./dataset-layout.component.css']
})
export class DatasetLayoutComponent implements OnInit {
  site$: Observable<Site>;
  mainDataset$: Observable<Dataset>;
  datasets$: Observable<List<Dataset>>;
  constructor(private sitesService: SitesService, private datasetsService: DatasetsService, private route: ActivatedRoute) { }

  ngOnInit() {
    if (!this.sitesService.initialized) {
      this.sitesService.init();
    }
    // Get the site
    this.site$ = this.route.params.pipe(
      switchMap((params) => {
        const site_id = +params.site_id;
        return this.sitesService.sitesState$.pipe(
          map(state => state.sites.find(site => site.id() === site_id)),
          share(),
        );
      })
    );

    this.site$.subscribe((site) => {
      if (!site) return;
      this.datasetsService.setDatasets(site.datasets() || []);
    });
    // Set the main dataset
    this.mainDataset$ = this.route.params.pipe(
      switchMap((params) => {
        const dataset_id = +params.dataset_id;
        return this.datasetsService.getState$().pipe(
          map(state => state.datasets.find(dataset => dataset.id() === dataset_id)),
          share(),
        );
    }));

    this.mainDataset$.subscribe((dataset) => {
      if (!dataset) return;
      this.datasetsService.setMainDataset(dataset);
    });

    // get the datasets
    this.datasets$ = this.datasetsService.getState$().pipe(
      map((state) => state.datasets),
      share()
    );
    // Get annotations for datasets
    this.datasets$.pipe(distinctUntilChanged()).subscribe(
      (datasets) => {
        console.log('datasets', datasets);
        if (datasets.size === 0) return;
        this.datasetsService.loadAnnotations(datasets.first());
      }
    )
  }

}
