import {
    GraphQLList,
    GraphQLObjectType,
    GraphQLString,
} from 'graphql';

import { fetchResponseByURLAsJSON } from '../util/fetch';

import { DatasetType } from './datasetType';

export const SiteType = new GraphQLObjectType({
    name: 'Site',
    description: 'A site contains many datasets',
    fields: () => ({
        id: { type: GraphQLString},
        name: { type: GraphQLString},
        datasets: {
            type: new GraphQLList(DatasetType),
            resolve: (site) => fetchResponseByURLAsJSON(`sites/${site.id}/datasets`),
        }
    })
});
