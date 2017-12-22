import {
    GraphQLList,
    GraphQLObjectType,
    GraphQLString,
} from 'graphql';

import { fetchResponseByURLAsJSON } from '../util/fetch';

import { DatasetType } from './datasetType';
import { ResourceType } from './resourceType';
import { GraphQLBoolean } from 'graphql/type/scalars';

export const AnnotationType = new GraphQLObjectType({
    name: 'Annotation',
    description: 'An Annotation has many resources and a geojson',
    fields: () => ({
        id: { type: GraphQLString },
        is_phantom: { type: GraphQLBoolean },
        type: { type: GraphQLString },
        meta: { type: GraphQLString },
        data: { type: GraphQLString },
        resources: {
            type: new GraphQLList(ResourceType),
            resolve: (anno) => fetchResponseByURLAsJSON(`annotations/${anno.id}/resources`)
        }
    })
});