import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import PouchDB from 'pouchdb';
console.log(PouchDB);

import { DatasetsService } from '../../datasets/datasets.service';

import { TerrainProvider } from '../../models/terrainProvider.model';

import * as fromRoot from '../../reducers';
import { Dataset } from '../../models/dataset.model';
import { AddTerrainProvider } from './actions/actions';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Map } from 'immutable';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { Smdjs } from '../../models/smdjs.model';
import { Mtljs } from '../../models/mtljs.model';
import { OSGJSScene } from '../../models/osgjs.model';

import { b64toBlob } from '../../util/b64toBlob';

const modelDB = new PouchDB('models');


interface FetchModel {
  id: string; // concat of datasetid and modelname so 0_00.osgjs
  mesh: string; // name of model _00.osgjs
  texture: string; // name of texture odm_textured_model_material0000_map_Kd.png,
  meshURL: string; // url to get mesh from if not found.
  textureURL: string;
}

interface FetchedModel {
  id: string;
  texture: Blob;
  mesh: OSGJSScene;
}

@Injectable()
export class TerrainProviderService {
  private providersSource = new BehaviorSubject<Map<number, TerrainProvider>>(Map());
  providers = this.providersSource.asObservable().pipe(distinctUntilChanged());
  constructor(private store: Store<fromRoot.State>) {
    this.getState$().subscribe((state) => {
      if (!state) return;
      this.providersSource.next(state.providers);
    });
  }

  public getState$() {
    return this.store.select('terrainProvider');
  }

  async fetchModel(toFetch: FetchModel): Promise<FetchedModel> {
    let found;
    try {
      found = await modelDB.get(toFetch.id, {attachments: true});
    } catch (e) {
      const [textureBlob, model] = await Promise.all([
        fetch(toFetch.textureURL).then(r => r.blob()),
        fetch(toFetch.meshURL).then(r => r.blob())
      ]);
      await modelDB.put({
        _id: toFetch.id,
        _attachments: {
          texture: {
            content_type: 'image/png',
            data: textureBlob,
          },
          mesh: {
            content_type: 'text/plain',
            data: model,
          }
        }
      });
      found = await modelDB.get(toFetch.id, {attachments: true});
    }
    // Check osgjs
    const texture = b64toBlob(found._attachments.texture.data, 'image/png');
    const mesh = JSON.parse(atob(found._attachments.mesh.data));
    return {
      id: toFetch.id,
      texture,
      mesh
    };
  }

  async loadTerrain(provider: TerrainProvider, smdjs: Smdjs, mtljs: Mtljs, smdjsURL: string) {
    //'Have to get all the textures and all the meshes';
    const baseURL = smdjsURL.split('_smdjs')[0];

    const sceneImagePairs: FetchModel[] = smdjs.Meshes.map((mesh) => {
      const texture = mtljs[mesh.split('.osgjs')[0]].map_Kd;
      return {
        id: `${provider.dataset().id()}${mesh}`,
        mesh,
        texture,
        meshURL: `${baseURL}${mesh}`,
        textureURL: `${baseURL}${texture}`,
      };
    });
    const models: FetchedModel[] = [];
    let count = 0;
    try {
      for (const pair of sceneImagePairs) {
        const fetched = await this.fetchModel(pair);
        models.push(fetched);
        console.log('got', ++count);
      }
    } catch (e) {
      console.error(e);
      return null;
    }
    let scenes;
    try {
      scenes = await Promise.all(models.map((model) => {
        return osgDB.parseSceneGraph(model.mesh).then(
          // convert from bluebird promise to native promise
          (node) => Promise.resolve(node),
          (err) => console.log(model.mesh)
        );
      }));
    } catch (e) {
      console.error(e);
      return null;
    }
    const root = new osg.MatrixTransform();
    osg.Matrix.makeRotate(1.5 * Math.PI, 1.0, 0.0, 0.0, root.getMatrix());
    const mtrans = new osg.MatrixTransform();
    const mnode = new osg.Node();
    root.addChild(mnode);

    // Add all minishes together
    scenes.forEach((scene) => {
      mnode.addChild(scene);
    });

    mtrans.addChild(mnode);
    // TODO: Figure out the parameters per acre of model
    // Creates a KdTree for faster intersections.
    const treeBuilder = new osg.KdTreeBuilder({
      _numVerticesProcessed: 0,
      _targetNumTrianglesPerLeaf: 50,
      _maxNumLevels: 20,
    });
    treeBuilder.apply(root);

    const bbox = mnode.getBoundingBox();
    const center = osg.Vec3.create();
    bbox.center(center);
    osg.Matrix.setTrans(mtrans.getMatrix(), -center[0], -center[1], -center[2]);

    return root;
  }

  public makeProvidersForDatasets(datasets: Dataset[]) {
    const providers = datasets.map(d => new TerrainProvider({dataset: d}));
    providers.forEach(p => this.store.dispatch(new AddTerrainProvider(p)));
  }
}
