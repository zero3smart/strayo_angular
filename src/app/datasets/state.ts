import { Record, List, Map } from 'immutable';
import { Dataset } from '../models/dataset.model';
import { Annotation } from '../models/annotation.model';

const datasetRecord = Record({
    annotations: Map({}),
    datasets: List([]),
    mainDataset: null,
    selectedDatasets: List([]),
    pending: false,
    error: null,
});

export class DatasetsState extends datasetRecord {
    annotations: Map<number, any>;
    datasets: List<Dataset>;
    mainDataset: Dataset;
    selectedDatasets: List<Dataset>;
    pending: boolean;
    error: Error;

    public getAnnotations(payload: Dataset): DatasetsState {
        return this.set('error', null).set('pending', true) as DatasetsState;
    }

    public getAnnotationsSuccess(payload: {dataset: Dataset, annotations: Annotation[]}): DatasetsState {
        return this
            .setIn(['annotations', payload.dataset.id()], List(payload.annotations))
            .set('pending', false).set('error', null) as DatasetsState;
    }

    public getAnnotationsError(error: Error) {
        return this.set('error', error).set('pending', false) as DatasetsState;
    }

    public setDatasets(datasets: Dataset[]): DatasetsState {
        return this.set('datasets', List(datasets)) as DatasetsState;
    }

    public setMainDataset(dataset: Dataset): DatasetsState {
        return this.set('mainDataset', dataset) as DatasetsState;
    }

    public setSelected(datasets: Dataset[]): DatasetsState {
        return this.set('selectedDatasets', List(datasets)) as DatasetsState;
    }
}

export function getInitialState() {
    return new DatasetsState();
}
