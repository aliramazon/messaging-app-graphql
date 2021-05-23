import express from "express";
import cors from "cors";
import { ApolloServer, AuthenticationError } from "apollo-server-express";
import jwt from "jsonwebtoken";
import "dotenv/config";

import schema from "./schema";
import resolvers from "./resolvers";
import models, { sequelize } from "./models";

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
    context: async ({ req }) => {
        return {
            models,
            me: await getMe(req),
            secret: process.env.SECRET
        };
    }
});

server.applyMiddleware({ app, path: "/graphql" });

const PORT = process.env.PORT || 8000;

const eraseDatabaseOnSync = true;
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

sequelize.sync({ force: eraseDatabaseOnSync }).then(() => {
    if (eraseDatabaseOnSync) {
        createUsersWithMessages(new Date());
    }

    app.listen({ port: PORT }, () => {
        console.log(`Apollo Server on https://localhost:${PORT}/graphql`);
    });
});
