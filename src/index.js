import express from "express";
import cors from "cors";
import { ApolloServer, gql } from "apollo-server-express";
import { v4 as uuidv4 } from "uuid";
import "dotenv/config";

const app = express();

app.use(cors());

const users = {
    1: {
        id: 1,
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
        id: 2,
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
let messages = {
    1: {
        id: 1,
        text: "Hello World",
        userId: 1
    },
    2: {
        id: 2,
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

    type Mutation {
        createMessage(text: String!): Message!
        deleteMessage(id: ID!): Boolean!
        updateMessage(id: ID!, text: String!): Message!
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

    Mutation: {
        createMessage: (parent, { text }, { me }) => {
            const id = uuidv4();
            const message = {
                id,
                text,
                userId: me.id
            };

            messages[id] = message;
            users[me.id].messageIds.push(id);

            return message;
        },

        deleteMessage: (parent, { id }, { me }) => {
            const { [id]: message, ...rest } = messages;
            if (!message) return false;

            const messageIdIdx = users[me.id].messageIds.indexOf(id.toString());
            users[me.id].messageIds.splice(messageIdIdx, 1);
            messages = rest;
            return true;
        },

        updateMessage: (parent, { id, text }) => {
            messages[id].text = text;
            return messages[id];
        }
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
