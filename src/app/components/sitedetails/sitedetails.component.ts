import { Component, OnInit, Input } from '@angular/core';

import { Site } from '../../models/site.model';

@Component({
  selector: 'app-sitedetails',
  templateUrl: './sitedetails.component.html',
  styleUrls: ['./sitedetails.component.css']
})
export class SitedetailsComponent implements OnInit {
  @Input() site: Site;
  constructor() { }

  ngOnInit() {
  }

}
