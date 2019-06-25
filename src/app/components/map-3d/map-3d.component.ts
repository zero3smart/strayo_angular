import { Component, OnInit, ViewChild, ElementRef, Input, NgZone, OnDestroy, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
const THREE = require('three');
console.log('THREE', THREE)
import { DatasetsService } from '../../datasets/datasets.service';
import { TerrainProviderService } from '../../services/terrainprovider/terrain-provider.service';
import { Dataset } from '../../models/dataset.model';
import { Annotation } from '../../models/annotation.model';

import { switchMap, map } from 'rxjs/operators';
import { Map } from 'immutable';
import { TerrainProvider } from '../../models/terrainProvider.model';
import { Map3dService } from '../../services/map-3d.service';

@Component({
  selector: 'app-map-3d',
  templateUrl: './map-3d.component.html',
  styleUrls: ['./map-3d.component.css']
})
export class Map3dComponent implements OnInit, OnDestroy {
  @ViewChild('openlayers', { read: ElementRef }) map2D: ElementRef;
  @ViewChild('osgjs', { read: ElementRef }) map3D: ElementRef;
  @ViewChild('three', { read: ElementRef }) three: ElementRef;
  @ViewChild('tooltip', { read: ElementRef }) tooltip: ElementRef;
  @Input() show = 'map2D';
  viewer: string;

  constructor(private http: HttpClient, private map3DService: Map3dService) { }

  ngOnInit() {
    // this.changeView('openlayers');
    const camera = new THREE.PerspectiveCamera(45, 1, 1, 2000);
    camera.position.z = 4;

    const scene = new THREE.Scene();
    const ambient = new THREE.AmbientLight( 0x444444 );
    scene.add(ambient);

    const directionalLight = new THREE.DirectionalLight(0xffeedd);
    directionalLight.position.set(0, 0, 1).normalize();
    scene.add(directionalLight);

    const objectLoader = new THREE.ObjectLoader();
    objectLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/json/teapot-claraio.json', (obj) => {
      scene.add(obj);
    });

    const renderer = new THREE.WebGLRenderer();
    setTimeout(() => {
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      this.three.nativeElement.appendChild(renderer.domElement);
      setInterval(() => {
        const three = $(this.three.nativeElement);
        const width = three.width();
        const height = three.height();
        console.log('width', width, height);
        camera.aspect = width/height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
      }, 200)
    }, 500);
    this.map3DService.toolTip = this.tooltip;
  }

  @HostListener('mousemove', ['$event']) onmousemove(event) {
    const tooltip = this.map3DService.toolTip;
    if (!tooltip) return;
    // console.log('mousemove', event);
    // tooltip.nativeElement.style.position = 'absolute';
    // tooltip.nativeElement.style.zIndex = '9999';
    $(tooltip.nativeElement).offset({
      // position: 'absolute',
      // zIndex: '9999',
      left: event.clientX + 15,
      top: event.clientY + 15
    });
    // tooltip.nativeElement.style.top = `${event.clientY} px`;
    // tooltip.nativeElement.style.left = `${event.clientX} px`;
  }

  changeView(viewer: string) {
    if (this.viewer === viewer) return;
    this.viewer = viewer;
    this.map3DService.destroy();
    setTimeout(() => {
      switch (this.viewer) {
        case 'openlayers':
          this.map3DService.initOpenlayers(this.map2D.nativeElement);
          break;
        case 'osgjs':
          this.map3DService.initOsgjs(this.map3D.nativeElement);
      }
    }, 100);
  }

  ngOnDestroy() {
    this.map3DService.destroyOpenlayers();
    this.map3DService.destroyOsgjs();
  }
}