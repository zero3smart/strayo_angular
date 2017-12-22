import { InMemoryDbService } from 'angular-in-memory-web-api';

import { getFullUrl } from '../util/getApiUrl';
import { Status } from '../util/status';

export class InMemoryDataService implements InMemoryDbService {
    createDb() {
        const oldCastleDatasetIds = [
            1, 2, 3 , 4, 5
        ];

        const chicoDatasetIds = [
            6, 7, 8, 9
        ];

        const siteIds = [
            1, 2
        ];

        // Every dataset gets two annotations, one for phantom, one for ortho one for stereo
        const annotationsPerDataSet = 3;
        
        // Every annotation has up to 20 resources (safe number)
        const resourcesPerDataSet = 20;
        
        const sites = siteIds.map((id) => {
            let name;
            let datasets;
            switch (id) {
                case 2:
                    name = 'Chico Muckpile';
                    datasets = oldCastleDatasetIds;
                    break;
                default:
                    name = 'Old Castle';
                    datasets = chicoDatasetIds;
            }
            return {
                id,
                name,
                datasets: datasets.map(i => getFullUrl(`datasets/${i}`)),
            };
        });

        const datasets = [...oldCastleDatasetIds, ...chicoDatasetIds].map((id) => {
            const fromOldCastle = oldCastleDatasetIds.indexOf(id);
            const fromChico = chicoDatasetIds.indexOf(id);
            const site = (fromOldCastle !== -1) ? sites[0] : sites[1];
            const name = `${site.name} ${fromOldCastle + fromChico + 1}`;
            const created_at = (new Date()).toISOString();
            // Two annotations, one for orthophoto, one for stereoscope
            const urls = (new Array(annotationsPerDataSet)).fill(1).map((_, index) => {
                return getFullUrl(`annotations/${id * annotationsPerDataSet + index}`);
            });
            return {
                id,
                name,
                created_at,
                annotations: urls,
            };
        });

        const annotations = [].concat(datasets.map((dataset) => {
            return (new Array(annotationsPerDataSet)).fill(1).map((_, index) => {
                let type;
                let is_phantom = true;
                let meta;
                let data;
                const id = dataset.id * annotationsPerDataSet + index;
                const urls = (new Array(resourcesPerDataSet)).fill(1).map((_, j) => {
                    return getFullUrl(`/resources/${j}`);
                });
                switch (id % annotationsPerDataSet) {
                    case 0:
                        type = 'phantom';
                        is_phantom = true;
                        meta = '{}';
                        data = '{}';
                        break;
                    case 1:
                        type = 'orthophoto';
                        meta = '{}';
                        data = '{}';
                        break;
                    default: 
                        type = 'stereoscope';
                        meta = '{}';
                        data = '{}';
                }
                return {
                    id,
                    data,
                    is_phantom,
                    meta,
                    resources: urls,
                    type,
                };
            });
        }));

        const resources = annotations.map((anno, j) => {
            const rId = anno.id * resourcesPerDataSet + j;
            return {
                id: rId,
                type: '',
                url: '',
                status: Status.COMPLETED,
            };
        });
        
        return {
            sites,
            datasets,
            annotations,
            resources,
        };
    }
};

