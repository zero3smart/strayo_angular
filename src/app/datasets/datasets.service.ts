import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

import * as d3 from 'd3';

import { tap, map, first, share } from 'rxjs/operators';
import { isNumeric } from 'rxjs/util/isNumeric';

import { DatasetsState } from './state';

import { Dataset } from '../models/dataset.model';

import * as fromRoot from '../reducers';
import { SetDatasets, SetMainDataset, GetAnnotations } from './actions/actions';
import { IAnnotation, Annotation } from '../models/annotation.model';
import { List, Map } from 'immutable';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { Resource } from '../models/resource.model';

const allAnnotationsQuery = gql`
  query AnnotationsForDataset($datasetID: String!) {
    dataset(id: $datasetID) {
      annotations {
        id,
        data,
        is_phantom,
        meta,
        type,
        resources {
          id,
          type,
          status,
          url
        }
      }
    }
  }
`;

@Injectable()
export class DatasetsService {
  private datasetsSource = new BehaviorSubject<List<Dataset>>(List([]));
  datasets = this.datasetsSource.asObservable().pipe(distinctUntilChanged());

  private mainDatasetSource = new BehaviorSubject<Dataset>(null);
  mainDataset = this.mainDatasetSource.asObservable().pipe(distinctUntilChanged());

  private annotationsSource = new BehaviorSubject<Map<number, List<Annotation>>>(Map());
  annotations = this.annotationsSource.asObservable().pipe(distinctUntilChanged());

  constructor(private store: Store<fromRoot.State>, private apollo: Apollo) {
    this.getState$().subscribe((state) => {
      if (!state) return;
      this.datasetsSource.next(state.datasets);
      this.mainDatasetSource.next(state.mainDataset);
      this.annotationsSource.next(state.annotations);
    });
  }

  public getState$() {
    return this.store.select('datasets');
  }

  public setDatasets(datasets: Dataset[]) {
    const colorScale = d3.scaleOrdinal(d3.schemeCategory20);
    datasets.forEach((set, i) => set.color(colorScale(i as any)));
    this.store.dispatch(new SetDatasets(datasets));
  }

  public setMainDataset(dataset: Dataset) {
    this.store.dispatch(new SetMainDataset(dataset));
  }

  public loadAnnotations(dataset: Dataset) {
    this.store.dispatch(new GetAnnotations(dataset));
  }

  public getAnnotations(dataset: Dataset): Observable<Annotation[]> {
    return this.apollo.watchQuery<{
        dataset: {
          annotations: IAnnotation[]
        }
      }>({
      query: allAnnotationsQuery,
      variables: { datasetID: dataset.id() }
    })
    .valueChanges
    .pipe(
      tap(thing => console.log('got all annotations', thing)),
      map(({ data }) => {
        return data.dataset.annotations.map((datum) => {
          const anno = new Annotation(datum);
          const resources: any[] = anno.resources() || [];
          anno.resources(resources.map(r => new Resource(r)));
          return anno;
        });
      })
    );
  }
}
