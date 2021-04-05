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

app.listen({ port: 8000 }, () => {
    console.log("Apollo Server on https://localhost:8000/graphql");
});
