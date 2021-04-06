import express from "express";
import cors from "cors";
import { ApolloServer, gql } from "apollo-server-express";
import "dotenv/config";

const app = express();

app.use(cors());

const schema = gql`
    type Query {
        me: User
        user(id: ID!): User
        users: [User!]!
    }

    type User {
        id: ID!
        username: String!
        email: String!
        skills: [Skill!]!
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
        ]
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
        ]
    }
};

const resolvers = {
    Query: {
        me: () => {
            return users[1];
        },
        user: (parent, { id }) => {
            return users[id];
        },
        users: () => {
            return Object.values(users);
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
