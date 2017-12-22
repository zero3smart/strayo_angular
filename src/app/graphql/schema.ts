import { GraphQLSchema } from 'graphql';

const typeDefs = `
type Site {
    id: ID!
    name: String!
    datasets: [Dataset]!
}

type Dataset {
    id: ID!
    name: String!
    created_at: String!
    annotations: [Annotation]!
}

type Annotation {
    id: ID!
    is_phantom: Boolean
    meta: String
    data: String
    resources: [Resource]!
    type: String!
}

type Resource {
    id: ID!
    url: String!
    meta: String
    type: String
}
`;