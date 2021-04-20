import express from "express";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import "dotenv/config";

import schema from "./schema";
import resolvers from "./resolvers";
import models, { sequelize } from "./models";

const app = express();

app.use(cors());

const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    formatError: (error) => {
        const message = error.message
            .replace("Validation error: ", "")
            .replace("SequelizeValidationError: ", "");

        return {
            ...error,
            message
        };
    },
    context: async () => ({
        models,
        me: await models.User.findByLogin("ali")
    })
});

server.applyMiddleware({ app, path: "/graphql" });

const PORT = process.env.PORT || 8000;

const eraseDatabaseOnSync = true;
const createUsersWithMessages = async () => {
    await models.User.create(
        {
            username: "ali",
            messages: [
                {
                    text: "Learning GQL"
                }
            ]
        },
        {
            include: [models.Message]
        }
    );

    await models.User.create(
        {
            username: "sultan",
            messages: [
                {
                    text: "hello halturiy"
                },
                {
                    text: "Mission style started"
                }
            ]
        },
        {
            include: [models.Message]
        }
    );
};

sequelize.sync({ force: eraseDatabaseOnSync }).then(() => {
    if (eraseDatabaseOnSync) {
        createUsersWithMessages();
    }

    app.listen({ port: PORT }, () => {
        console.log(`Apollo Server on https://localhost:${PORT}/graphql`);
    });
});
