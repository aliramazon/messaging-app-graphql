import express from "express";
import cors from "cors";
import { ApolloServer, gql } from "apollo-server-express";
import "dotenv/config";

const app = express();

app.use(cors());

const users = {
    1: {
        id: "1",
        username: "Ali Ramazon",
        email: "safarnov@gmail.com",
        skills: [
            {
                name: "React",
                proficiency: "Advanced"
            }
        ],
        messageIds: [1]
    },
    2: {
        id: "2",
        username: "John Smith",
        email: "jsmith@gmail.com",
        skills: [
            {
                name: "Node",
                proficiency: "Advanced"
            }
        ],
        messageIds: [2]
    }
};
const messages = {
    1: {
        id: "1",
        text: "Hello World",
        userId: "1"
    },
    2: {
        id: "2",
        text: "By World",
        userId: 2
    }
};

const schema = gql`
    type Query {
        me: User
        user(id: ID!): User
        users: [User!]!
        messages: [Message!]
        message(id: ID!): Message!
    }

    type User {
        id: ID!
        username: String!
        email: String!
        skills: [Skill!]!
        messages: [Message!]!
    }

    type Message {
        id: ID!
        text: String!
        user: User!
    }

    enum SkillProficiency {
        Advanced
        Intermediate
        Beginner
    }

    type Skill {
        name: String!
        proficiency: SkillProficiency
    }
`;

const resolvers = {
    Query: {
        me: (parent, args, { me }) => {
            return me;
        },
        user: (parent, { id }) => {
            return users[id];
        },
        users: () => {
            return Object.values(users);
        },

        messages: () => Object.values(messages),
        message: (parent, { id }) => messages[id]
    },

    User: {
        messages: (user) => {
            // return Object.values(messages).filter(
            //     (message) => message.userId === user.id
            // );

            return user.messageIds.map((messageId) => messages[messageId]);
        }
    },

    Message: {
        user: (message) => {
            return users[message.userId];
        }
    }
};

const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: {
        me: users[1]
    }
});

server.applyMiddleware({ app, path: "/graphql" });

const PORT = process.env.PORT || 8000;

app.listen({ port: PORT }, () => {
    console.log(`Apollo Server on https://localhost:${PORT}/graphql`);
});
