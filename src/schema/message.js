import { gql } from "apollo-server-express";

const messageSchema = gql`
    extend type Query {
        messages(cursor: String, limit: Int): MessageConnection!
        message(id: ID!): Message!
    }

    extend type Mutation {
        createMessage(text: String!): Message!
        deleteMessage(id: ID!): Boolean!
        updateMessage(id: ID!, text: String!): Message!
    }

    type MessageConnection {
        edges: [Message!]!
        pageInfo: PageInfo!
    }

    type PageInfo {
        endCursor: String
        hasNextPage: Boolean!
    }

    type Message {
        id: ID!
        text: String!
        user: User!
        createdAt: Date!
    }

    extend type Subscription {
        messageCreated: MessageCreated
    }

    type MessageCreated {
        message: Message!
    }
`;

export default messageSchema;
