import express from "express";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import "dotenv/config";

import schema from "./schema";
import resolvers from "./resolvers";
import models from "./models";

const app = express();

app.use(cors());

const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: {
        models,
        me: models.users[1]
    }
});

server.applyMiddleware({ app, path: "/graphql" });

const PORT = process.env.PORT || 8000;

app.listen({ port: PORT }, () => {
    console.log(`Apollo Server on https://localhost:${PORT}/graphql`);
});
