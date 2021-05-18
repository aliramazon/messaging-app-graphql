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

        deleteUser(id: ID!): Boolean!
    }

    type User {
        id: ID!
        username: String!
        email: String!
        # skills: [Skill!]!
        messages: [Message!]!
        role: UserRoles
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

    enum UserRoles {
        ADMIN
        BASIC
    }
`;

export default userSchema;
