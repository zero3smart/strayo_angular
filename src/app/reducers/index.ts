import * as sites from '../sites/reducers/reducer';
import { SitesState } from '../sites/state';

import * as datasets from '../datasets/reducers/reducer';
import { DatasetsState } from '../datasets/state';

export const reducers = {
    sites: sites.reducer,
    datasets: datasets.reducer
};

export interface State {
    sites: SitesState;
    datasets: DatasetsState;
}

export const getSitesState = (state: State) => {
    return state.sites;
};

export const getDatasetsState = (state: State) => {
    return state.datasets;
};

