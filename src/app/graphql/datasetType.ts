import {
    GraphQLList,
    GraphQLObjectType,
    GraphQLString,
} from 'graphql';

import { getFullUrl } from '../util/getApiUrl';

import { AnnotationType } from './annotationType';
import { ResourceType } from './resourceType';


export const DatasetType = new GraphQLObjectType({
    name: 'Dataset',
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
            resolve: (dataset, args, context) => context.client.get(getFullUrl(`datasets/${dataset.id}/annotations`)).toPromise(),
        },
    })
});
