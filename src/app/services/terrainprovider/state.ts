import { Record, Map } from 'immutable';

import { TerrainProvider, TerrainModel } from '../../models/terrainProvider.model';

const terrainProviderState = Record({
    providers: Map({}),
    pending: false,
    error: null,
});

export class TerrainProviderState extends terrainProviderState {
    error: Error;
    providers: Map<number, TerrainProvider>;
    pending: boolean;

    addTerrainProvider(provider: TerrainProvider): TerrainProviderState {
        const check: TerrainProvider = this.getIn(['providers', provider.dataset().id()]);
        if (check) {
            const update = Object.assign({}, check.getProperties(), provider.getProperties());
            check.setProperties(update);
            provider = check;
        }
        return this.setIn(['providers', provider.dataset().id()], provider) as TerrainProviderState;
    }

    loadTerrain(params: any): TerrainProviderState {
        return this.set('pending', true).set('error', false) as TerrainProviderState;
    }

    loadTerrainSuccess(params: { provider: TerrainProvider, model: TerrainModel}): TerrainProviderState {
        const { provider, model } = params;
        const exist = this.getIn(['providers', provider.dataset().id()]);
        let newState: TerrainProviderState = this;
        if (!exist) {
            newState = this.addTerrainProvider(provider);
        }
        const found: TerrainProvider = newState.getIn(['providers', provider.dataset().id()]);
        found.model(model);
        return newState.set('pending', false) as TerrainProviderState;
    }

    loadTerrainError(err: Error): TerrainProviderState {
        return this.set('pending', false).set('error', err) as TerrainProviderState;
    }
}

export function getInitialState() {
    return new TerrainProviderState();
}
