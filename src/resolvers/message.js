import { v4 as uuidv4 } from "uuid";

const messageResolvers = {
    Query: {
        messages: (parent, args, { models }) => {
            return Object.values(models.messages);
        },
        message: (parent, { id }, { models }) => {
            return models.messages[id];
        }
    },
    Mutation: {
        createMessage: (parent, { text }, { me, models }) => {
            const id = uuidv4();
            const message = {
                id,
                text,
                userId: me.id
            };

            models.messages[id] = message;
            models.users[me.id].messageIds.push(id);

            return message;
        },

        deleteMessage: (parent, { id }, { me, models }) => {
            const { [id]: message, ...rest } = models.messages;
            if (!message) return false;

            const messageIdIdx = models.users[me.id].messageIds.indexOf(
                id.toString()
            );
            models.users[me.id].messageIds.splice(messageIdIdx, 1);
            models.messages = rest;
            return true;
        },

        updateMessage: (parent, { id, text }, { models }) => {
            const message = models.messages[id];
            if (!message) return undefined;
            message.text = text;
            return models.messages[id];
        }
    },
    Message: {
        user: (message, args, { models }) => {
            return models.users[message.userId];
        }
    }
};

export default messageResolvers;