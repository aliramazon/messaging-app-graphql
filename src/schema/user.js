import { gql } from "apollo-server-express";

const userSchema = gql`
    extend type Query {
        me: User
        user(id: ID!): User
        users: [User!]!
    }

    type User {
        id: ID!
        username: String!
        email: String!
        skills: [Skill!]!
        messages: [Message!]!
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

export default userSchema;
