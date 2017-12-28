import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

import * as d3 from 'd3';

import { tap, map, first } from 'rxjs/operators';
import { isNumeric } from 'rxjs/util/isNumeric';

import { DatasetsState } from './state';

import { Dataset } from '../models/dataset.model';

import * as fromRoot from '../reducers';
import { SetDatasets, SetMainDataset, GetAnnotations } from './actions/actions';
import { IAnnotation, Annotation } from '../models/annotation.model';

const allAnnotationsQuery = gql`
  query AnnotationsForDataset($datasetID: String!) {
    dataset(id: $datasetID) {
      annotations {
        id
      }
    }
  }
`;

@Injectable()
export class DatasetsService {
  constructor(private store: Store<fromRoot.State>, private apollo: Apollo) {
    console.log('in constructor');
  }

  public getState$() {
    return this.store.select('datasets');
  }

  public setDatasets(datasets: Dataset[]) {
    const colorScale = d3.scaleOrdinal(d3.schemeCategory20);
    datasets.forEach((set, i) => set.color(colorScale(i as any)));
    this.store.dispatch(new SetDatasets(datasets));
  }

  public setMainDataset(dataset: Dataset | number) {
    if (isNumeric(dataset)) {
      this.getState$().pipe(
        first()
      )
      .subscribe((state) => {
        const found = state.datasets.find((d) => d.id() === dataset);
        if (!found) {
          console.error('Could not find dataset with that id');
          return;
        }
        this.store.dispatch(new SetMainDataset(found));
      });
      return;
    }
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
        return data.dataset.annotations.map((datum) => new Annotation(datum));
      })
    );
  }
}
