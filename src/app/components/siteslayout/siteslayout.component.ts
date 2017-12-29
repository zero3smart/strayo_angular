import { Component, OnInit } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { List } from 'immutable';

import { SitesService } from '../../sites/sites.service';
import { Site } from '../../models/site.model';

import { map } from 'rxjs/operators';

@Component({
  selector: 'app-siteslayout',
  templateUrl: './siteslayout.component.html',
  styleUrls: ['./siteslayout.component.css'],
})
export class SiteslayoutComponent implements OnInit {

  sites$: Observable<List<Site>>;
  constructor(private sitesService: SitesService) { }

  ngOnInit() {
    this.sites$ = this.sitesService.sites;
  }

}
