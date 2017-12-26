import { Action } from '@ngrx/store';

import { Site } from '../../models/site.model';

export enum SitesActionsType {
    GET_SITES = '[Site] Get',
    GET_SITES_SUCCESS = '[Site] Get Success',
    GET_SITES_ERROR = '[Site] Get Error',
    SET_SITES = '[Site] Set',
    RESET = '[Site] Reset',
}

export class GetSites implements Action {
    type = SitesActionsType.GET_SITES;
    constructor(public payload?) {}
}

export class GetSitesSuccess implements Action {
    type = SitesActionsType.GET_SITES_SUCCESS;
    constructor(public payload: Site[]) {}
}

export class GetSitesError implements Action {
    type = SitesActionsType.GET_SITES_ERROR;
    constructor(public payload: Error) {}
}

export class SetSites implements Action {
    type = SitesActionsType.SET_SITES;

    constructor(public payload: Site[]) {}
}

export class ResetState implements Action {
    type = SitesActionsType.RESET;
    constructor(public payload) {}
}

export type SitesActions = GetSites
| GetSitesSuccess
| GetSitesError
| SetSites
| ResetState;
