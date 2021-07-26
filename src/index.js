import express from "express";

import cors from "cors";
import { ApolloServer, AuthenticationError } from "apollo-server-express";
import jwt from "jsonwebtoken";
import http from "http";
import DataLoader from "dataloader";

import "dotenv/config";
import models, { sequelize } from "./models";
import schema from "./schema";
import resolvers from "./resolvers";
import loaders from "./loaders";

const app = express();

app.use(cors());

const getMe = async (req) => {
    const token = req.headers["x-token"];

    if (token) {
        try {
            return await jwt.verify(token, process.env.SECRET);
        } catch (e) {
            throw new AuthenticationError(
                "Your session expired. Sign in again"
            );
        }
    }
};

const server = new ApolloServer({
    introspection: true,
    playground: true,
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
    context: async ({ req, connection }) => {
        if (connection)
            return {
                models,
                loaders: {
                    user: new DataLoader((keys) =>
                        loaders.user.batchUsers(keys, models)
                    )
                }
            };

        if (req) {
            return {
                models,
                me: await getMe(req),
                secret: process.env.SECRET,
                loaders: {
                    user: new DataLoader((keys) =>
                        loaders.user.batchUsers(keys, models)
                    )
                }
            };
        }
    }
});

server.applyMiddleware({ app, path: "/graphql" });
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

const PORT = process.env.PORT || 8000;

const createUsersWithMessages = async (date) => {
    await models.User.create(
        {
            username: "ali",
            email: "hello@ali.com",
            password: "password123",
            messages: [
                {
                    text: "Learning GQL",
                    createdAt: date.setSeconds(date.getSeconds() + 1)
                }
            ],
            role: "ADMIN"
        },
        {
            include: [models.Message]
        }
    );

    await models.User.create(
        {
            username: "sultan",
            email: "hello@sultan.com",
            password: "password1234",
            messages: [
                {
                    text: "hello halturiy",
                    createdAt: date.setSeconds(date.getSeconds() + 1)
                },
                {
                    text: "Mission style started",
                    createdAt: date.setSeconds(date.getSeconds() + 1)
                }
            ]
        },
        {
            include: [models.Message]
        }
    );
};

const isTestEnv = !!process.env.TEST_DATABASE;
const isProdEnv = !!process.env.DATABASE_URL;

sequelize.sync({ force: isTestEnv || isProdEnv }).then(() => {
    if (isTestEnv || isProdEnv) {
        createUsersWithMessages(new Date());
    }

    httpServer.listen({ port: PORT }, () => {
        console.log(`Apollo Server on https://localhost:${PORT}/graphql`);
    });
});
