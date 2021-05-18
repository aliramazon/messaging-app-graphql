import jwt from "jsonwebtoken";
import { AuthenticationError, UserInputError } from "apollo-server";
import { combineResolvers } from "graphql-resolvers";
import models from "../models";
import { isAdmin } from "./auth";

const createToken = async (user, secret, expiresIn) => {
    const { id, email, username, role } = user;
    return await jwt.sign({ id, email, username, role }, secret, {
        expiresIn
    });
};

const userResolvers = {
    Query: {
        me: async (parent, args, { models, me }) => {
            return await models.User.findByPk(me.id);
        },
        user: async (parent, { id }, { models }) => {
            return await models.User.findByPk(id);
        },
        users: async (parent, args, { models }) => {
            return await models.User.findAll();
        }
    },
    Mutation: {
        signUp: async (
            parent,
            { username, email, password },
            { models, secret }
        ) => {
            const user = await models.User.create({
                username,
                email,
                password
            });
            return { token: createToken(user, secret, "30m") };
        },

        signIn: async (parent, { login, password }, { models, secret }) => {
            const user = await models.User.findByLogin(login);

            if (!user) {
                throw new UserInputError("No user found");
            }

            const isValidPassword = await user.validatePassword(password);

            if (!isValidPassword) {
                throw new AuthenticationError("Invalid password or username");
            }

            return { token: createToken(user, secret, "30m") };
        },

        deleteUser: combineResolvers(
            isAdmin,
            async (parent, { id }, { models }) => {
                return await models.User.destroy({
                    where: { id }
                });
            }
        )
    },

    User: {
        messages: async (user, args, { models }) => {
            return await models.Message.findAll({
                where: {
                    userId: user.id
                }
            });
        }
    }
};

export default userResolvers;
