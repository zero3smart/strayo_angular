import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import * as ol from 'openlayers';
import { SitesService } from '../../sites/sites.service';

@Component({
  selector: 'app-sitemap',
  templateUrl: './sitemap.component.html',
  styleUrls: ['./sitemap.component.css']
})
export class SitemapComponent implements OnInit {
  map: ol.Map;
  @ViewChild('map', { read: ElementRef }) mapElement: ElementRef;
  markers: ol.Collection<ol.Feature>;
  constructor(private sitesService: SitesService) {
  }

  ngOnInit() {
    this.markers = new ol.Collection<ol.Feature>([]);

    this.map = new ol.Map({
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        }),
        new ol.layer.Vector({
          source: new ol.source.Vector({
            features: this.markers,
          })
        })
      ],
      controls: [],
      target: this.mapElement.nativeElement,
      view: new ol.View({
        center: ol.proj.fromLonLat([37.41, 8.82]),
        zoom: 4,
      })
    });

    this.sitesService.sites.subscribe(
      (sites) => {
        this.markers.clear();
        this.markers.extend(sites.map((site) => {
          const dataset = site.getPhantomDataset();
          return new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.fromLonLat([dataset.long(), dataset.lat()])),
            name: site.name,
          });
        }).toJS());
        // Update view
        const points = this.markers.getArray().map(f => (f.getGeometry() as ol.geom.Point).getCoordinates());
        if (points.length > 0) {
          if (points.length > 1) {
            const extent = ol.extent.boundingExtent(points);
            this.map.getView().fit(extent);
          } else {
            this.map.getView().setCenter(points[0]);
          }
        }
        console.log('points', points);
      }
    );
  }

}
