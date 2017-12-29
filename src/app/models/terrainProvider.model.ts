import * as ol from 'openlayers';
import { Dataset } from './dataset.model';

export interface TerrainModel {

}

export class TerrainProvider extends ol.Object {
    constructor(props?: {}) {
        super(props);
        this.rootNode(new osg.Node());
    }

    public dataset(): Dataset;
    public dataset(dataset: Dataset): this;
    public dataset(dataset?: Dataset): Dataset | this {
        if (dataset !== undefined) {
            this.set('dataset', dataset);
            return this;
        }
        return this.get('dataset');
    }

    public model(): TerrainModel;
    public model(model: TerrainModel): this;
    public model(model?: TerrainModel): TerrainModel | this {
        if (model !== undefined) {
            this.set('model', model);
            return this;
        }
        return this.get('model');
    }

    public rootNode(): osg.Node;
    public rootNode(rootNode: osg.Node): this;
    public rootNode(rootNode?: osg.Node): osg.Node | this {
        if (rootNode !== undefined) {
            this.set('root_node', rootNode);
            return this;
        }
        return this.get('root_node');
    }
}