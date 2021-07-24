import { gql } from "apollo-server-express";

const messageSchema = gql`
    extend type Query {
        messages(cursor: String, limit: Int): [Message!]!
        message(id: ID!): Message!
    }

    extend type Mutation {
        createMessage(text: String!): Message!
        deleteMessage(id: ID!): Boolean!
        updateMessage(id: ID!, text: String!): Message!
    }

    type Message {
        id: ID!
        text: String!
        user: User!
        createdAt: Date!
    }
`;

export default messageSchema;
