import * as sites from '../sites/reducers/reducer';
import { SitesState } from '../sites/state';

import * as datasets from '../datasets/reducers/reducer';
import { DatasetsState } from '../datasets/state';

import * as terrainProvider from '../services/terrainprovider/reducers/reducer';
import { TerrainProviderState } from '../services/terrainprovider/state';

export const reducers = {
    sites: sites.reducer,
    datasets: datasets.reducer,
    terrainProvider: terrainProvider.reducer
};

export interface State {
    sites: SitesState;
    datasets: DatasetsState;
    terrainProvider: TerrainProviderState;
}

export const getSitesState = (state: State) => {
    return state.sites;
};

export const getDatasetsState = (state: State) => {
    return state.datasets;
};

export const getTerrainProviderState = (state: State) => {
    return state.terrainProvider;
}

