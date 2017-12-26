import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';

import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';

import { SitesActionsType, GetSitesSuccess, GetSitesError, GetSites } from '../actions/actions';
import { SitesService } from '../sites.service';

@Injectable()
export class SitesEffects {
    constructor(private actions$: Actions, private sitesService: SitesService) {}

    @Effect() getSites$ = this.actions$.ofType(SitesActionsType.GET_SITES)
        .map((action: GetSites) => action.payload)
        .mergeMap(action => {
            return this.sitesService.getSites()
                .map(sites => new GetSitesSuccess(sites))
                // .catch((error) => new GetSitesError(sites))
        });
}
