import {
    GraphQLList,
    GraphQLObjectType,
    GraphQLString,
} from 'graphql';

import { fetchResponseByURLAsJSON } from '../util/fetch';

import { SiteType } from './siteType';
import { DatasetType } from './datasetType';
import { AnnotationType } from './annotationType';
import { ResourceType } from './resourceType';
import { GraphQLSchema } from 'graphql/type/schema';

export const QueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'The root of all... queries',
    fields: () => ({
        allSites: {
            type: new GraphQLList(SiteType),
            resolve: (root) => {},
        },
        site: {
            type: SiteType,
            args: {
                id: { type: GraphQLString},
            },
            resolve: (root, args) => fetchResponseByURLAsJSON(`sites/${args.id}/`)
        },
        dataset: {
            type: DatasetType,
            args: {
                id: { type: GraphQLString},
            },
            resolve: (root, args) => fetchResponseByURLAsJSON(`datasets/${args.id}/`)
        },
        annotation: {
            type: AnnotationType,
            args: {
                id: { type: GraphQLString},
            },
            resolve: (root, args) => fetchResponseByURLAsJSON(`annotations/${args.id}/`)
        },
        resource: {
            type: ResourceType,
            args: {
                id: { type: GraphQLString},
            },
            resolve: (root, args) => fetchResponseByURLAsJSON(`resources/${args.id}/`)
        }
    })
});
