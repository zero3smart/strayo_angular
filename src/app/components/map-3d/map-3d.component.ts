import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatasetsService } from '../../datasets/datasets.service';
import { TerrainProviderService } from '../../services/terrainprovider/terrain-provider.service';
import { Dataset } from '../../models/dataset.model';
import { Annotation } from '../../models/annotation.model';

import { switchMap, map } from 'rxjs/operators';
import { Map } from 'immutable';
import { TerrainProvider } from '../../models/terrainProvider.model';

@Component({
  selector: 'app-map-3d',
  templateUrl: './map-3d.component.html',
  styleUrls: ['./map-3d.component.css']
})
export class Map3dComponent implements OnInit {
  @ViewChild('openlayers', { read: ElementRef }) map2D: ElementRef;
  @ViewChild('osgjs', { read: ElementRef }) map3D: ElementRef;
  @Input() show = 'map2D';
  map3DViewer: osgViewer.Viewer;

  mainDataset: Dataset;
  providers: Map<number, TerrainProvider>;
  sceneRoot: osg.Node;
  constructor(private http: HttpClient,
    private datasetsService: DatasetsService, private terrainProviderService: TerrainProviderService) { }

  ngOnInit() {
    this.map3DViewer = new osgViewer.Viewer(this.map3D.nativeElement);
    this.map3DViewer.init();
    const rootNode = new osg.Node();
    this.sceneRoot = rootNode;
    this.map3DViewer.setSceneData(rootNode);
    this.map3DViewer.setupManipulator();
    this.map3DViewer.run();

    // Get the main dataset
    this.datasetsService.mainDataset.subscribe((mainDataset) => {
      this.mainDataset = mainDataset;
      if (!mainDataset) return;
      // console.log('CREATING Provider for ', mainDataset.getProperties());
      this.terrainProviderService.makeProvidersForDatasets([mainDataset]);
    });

    // Get the providers
    this.terrainProviderService.providers.subscribe((providers) => {
      this.providers = providers;
    });

    // Get the annotations for main dataset
    this.datasetsService.mainDataset.pipe(
      switchMap((dataset) => {
        return this.datasetsService.annotations.pipe(
          map(annotations => annotations.get((dataset && dataset.id()) || null))
        );
      })
    ).subscribe((annotations) => {
      if (!annotations) return;
      // Check for
      this.updateTerrainProviderFromAnnotations(this.mainDataset, annotations.toJS());
      console.log('dataset', this.mainDataset.getProperties());
      console.log('annotations', annotations.map(anno => anno.getProperties()).toJS());
    });
  }

  async updateTerrainProviderFromAnnotations(dataset: Dataset, annotations: Annotation[]) {
    // Search for smdjs and mtljs in annotations
    const stereoscopeAnno = annotations.find(anno => anno.type() === 'stereoscope');
    if (!stereoscopeAnno) return;
    const mtljsResource = stereoscopeAnno.resources().find(r => r.type() === 'mtljs');
    const smdjsResource = stereoscopeAnno.resources().find(r => r.type() === 'smdjs');
    if (!(mtljsResource && smdjsResource)) return;
    console.log('found prerequisit resources');

    let mtljs;
    let smdjs;
    try {
      mtljs = await fetch(mtljsResource.url()).then(r => r.json());
      smdjs = await fetch(smdjsResource.url()).then(r => r.json());
      console.log('mtljs, smdjs', mtljs, smdjs);
    } catch (e) {
      console.error(e);
      return;
    }

    const provider = this.providers.get(dataset.id());
    console.log('found provider', provider);

    const node = await this.terrainProviderService.loadTerrain(provider, smdjs, mtljs, smdjsResource.url());
    // this.sceneRoot.addChild(node);
    // (this.map3DViewer as any).getManipulator().computeHomePosition();
  }

}
