import {
    GraphQLList,
    GraphQLObjectType,
    GraphQLString,
} from 'graphql';

import { getFullUrl } from '../util/getApiUrl';

import { DatasetType } from './datasetType';

export const SiteType = new GraphQLObjectType({
    name: 'Site',
    description: 'A site contains many datasets',
    fields: () => ({
        id: { type: GraphQLString},
        name: { type: GraphQLString},
        datasets: {
            type: new GraphQLList(DatasetType),
            resolve: (site, args, context) => context.client.get(getFullUrl(`sites/${site.id}/datasets`)),
        }
    })
});
