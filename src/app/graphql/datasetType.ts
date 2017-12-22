import {
    GraphQLList,
    GraphQLObjectType,
    GraphQLString,
} from 'graphql';

import { fetchResponseByURLAsJSON } from '../util/fetch';

import { AnnotationType } from './annotationType';
import { ResourceType } from './resourceType';


export const DatasetType = new GraphQLObjectType({
    name: 'DataSet',
    description: 'A Dataset has many annotations',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        createdAt: {
            type: GraphQLString,
            resolve: (dataset) => dataset.created_at,
        },
        annotations: {
            type: new GraphQLList(AnnotationType),
            resolve: (dataset) => fetchResponseByURLAsJSON(`datasets/${dataset.id}/annotations`),
        },
    })
});