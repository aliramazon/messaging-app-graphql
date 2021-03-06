import { combineResolvers } from "graphql-resolvers";
import { Sequelize } from "sequelize";
import { isAuthenticated, isMessageOwner } from "./auth";
import pubsub, { EVENTS } from "../subscription";

const encodeCursor = (string) => Buffer.from(string).toString("base64");
const decodeCursor = (string) =>
    Buffer.from(string, "base64").toString("ascii");
const messageResolvers = {
    Query: {
        messages: async (parent, { cursor, limit = 100 }, { models }) => {
            const cursorOptions = cursor
                ? {
                      where: {
                          createdAt: {
                              [Sequelize.Op.lt]: decodeCursor(cursor)
                          }
                      }
                  }
                : {};
            const messages = await models.Message.findAll({
                order: [["createdAt", "DESC"]],
                limit: limit + 1,
                ...cursorOptions
            });
            let hasNextPage = messages.length > limit;
            let edges = hasNextPage ? messages.slice(0, -1) : messages;

            return {
                edges,
                pageInfo: {
                    endCursor: hasNextPage
                        ? encodeCursor(
                              edges[edges.length - 1].createdAt.toString()
                          )
                        : null,
                    hasNextPage
                }
            };
        },
        message: async (parent, { id }, { models }) => {
            return await models.Message.findByPk(id);
        }
    },

    Mutation: {
        createMessage: combineResolvers(
            isAuthenticated,
            async (parent, { text }, { me, models }) => {
                const message = await models.Message.create({
                    text,
                    userId: me.id
                });

                pubsub.publish(EVENTS.MESSAGE.CREATED, {
                    messageCreated: { message }
                });

                return message;
            }
        ),

        deleteMessage: combineResolvers(
            isAuthenticated,
            isMessageOwner,
            async (parent, { id }, { models }) => {
                return await models.Message.destroy({ where: { id } });
            }
        )
    },

    Message: {
        user: async (message, args, { loaders }) => {
            return await loaders.user.load(message.userId);
        }
    },

    Subscription: {
        messageCreated: {
            subscribe: () => pubsub.asyncIterator(EVENTS.MESSAGE.CREATED)
        }
    }
};
export default messageResolvers;
