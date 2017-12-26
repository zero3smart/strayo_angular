import * as sites from '../sites/reducers/reducer';
import { SitesState } from '../sites/state';

export const reducers = {
    sites: sites.reducer
};

export interface State {
    sites: SitesState;
}

export const getSitesState = (state: State) => {
    return state.sites;
};
