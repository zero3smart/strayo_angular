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
  site: Site;
  mainDataset: Dataset;
  datasets: List<Dataset>;

  site$: Observable<Site>;
  mainDataset$: Observable<Dataset>;
  datasets$: Observable<List<Dataset>>;
  constructor(private sitesService: SitesService, private datasetsService: DatasetsService, private route: ActivatedRoute) { }

  ngOnInit() {
    // Get the site
    this.route.params.pipe(
      switchMap((params) => {
        const site_id = +params.site_id;
        return this.sitesService.sites.pipe(
          map(sites => sites.find(site => site.id() === site_id)),
        );
      })
    ).subscribe((site) => {
      this.site = site;
      if (!site) return;
      console.log('SITE', site);
      this.sitesService.setMainSite(site);
      this.datasetsService.setDatasets(site.datasets());
    });
    // Setting main
    this.route.params.pipe(
      switchMap((params) => {
        const dataset_id = +params.dataset_id;
        return this.datasetsService.datasets.pipe(
          map(datasets => datasets.find(dataset => dataset.id() === dataset_id))
        );
      })
    ).subscribe((dataset) => {
      if (!dataset) {
        // console.log('RACE CONDITION couldnt get datasets');
        return;
      }
      // console.log('SETTING MAIN DATASETS', dataset);
      this.datasetsService.setMainDataset(dataset);
    });

    // Getting datasets
    this.datasetsService.datasets.subscribe((datasets) => {
      // console.log('DATASETS', datasets);
      this.datasets = datasets;
    });

    // Getting main
    this.datasetsService.mainDataset.subscribe((dataset) => {
      this.mainDataset = dataset;
      if (!dataset) return;
      // console.log('loading annotations for ', dataset);
      this.datasetsService.loadAnnotations(dataset);
    });
  }

}