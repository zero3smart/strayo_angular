import {
    GraphQLList,
    GraphQLObjectType,
    GraphQLString,
} from 'graphql';

import { DatasetType } from './datasetType';

export const ResourceType = new GraphQLObjectType({
    name: 'Resource',
    description: 'An Resource is the location to some resource',
    fields: () => ({
        id: { type: GraphQLString },
        type: { type: GraphQLString },
        url: { type: DatasetType},
        status: { type: GraphQLString },
    })
});