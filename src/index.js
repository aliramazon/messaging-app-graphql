import express from "express";
import cors from "cors";
import { ApolloServer, gql } from "apollo-server-express";
import "dotenv/config";

const app = express();

app.use(cors());

const schema = gql`
    type Query {
        me: User
    }

    type User {
        username: String!
    }
`;

const resolvers = {
    Query: {
        me: () => {
            return {
                username: "Ali Ramazon"
            };
        }
    }
};

const server = new ApolloServer({
    typeDefs: schema,
    resolvers
});

server.applyMiddleware({ app, path: "/graphql" });

const PORT = process.env.PORT || 8000;

app.listen({ port: PORT }, () => {
    console.log(`Apollo Server on https://localhost:${PORT}/graphql`);
});
