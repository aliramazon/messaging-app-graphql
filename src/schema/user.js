import { gql } from "apollo-server-express";

const userSchema = gql`
    extend type Query {
        me: User
        user(id: ID!): User
        users: [User!]!
    }

    extend type Mutation {
        signUp(username: String!, email: String!, password: String): Token!

        signIn(login: String!, password: String!): Token!
    }

    type User {
        id: ID!
        username: String!
        email: String!
        # skills: [Skill!]!
        messages: [Message!]!
    }

    type Token {
        token: String!
    }

    # enum SkillProficiency {
    #     Advanced
    #     Intermediate
    #     Beginner
    # }

    # type Skill {
    #     name: String!
    #     proficiency: SkillProficiency
    # }
`;

export default userSchema;
