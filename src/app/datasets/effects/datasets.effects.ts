import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';

import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import { DatasetsService } from '../datasets.service';
import { DatasetsActionsType, GetAnnotations, GetAnnotationsSuccess } from '../actions/actions';

@Injectable()
export class DatasetsEffects {
    constructor(private actions$: Actions, private datasetsService: DatasetsService) {}

    @Effect() getAnnotations$ = this.actions$.ofType(DatasetsActionsType.GET_ANNOTATIONS)
        .map((action: GetAnnotations) => action.payload)
        .mergeMap(dataset => {
            return this.datasetsService.getAnnotations(dataset)
                .map(annotations => new GetAnnotationsSuccess({dataset, annotations}));
        });
}
