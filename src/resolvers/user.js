const userResolvers = {
    Query: {
        me: (parent, args, { me }) => {
            return me;
        },
        user: (parent, { id }) => {
            return users[id];
        },
        users: (parent, args, { models }) => {
            return Object.values(models.users);
        }
    },
    User: {
        messages: (user, args, { models }) => {
            // return Object.values(messages).filter(
            //     (message) => message.userId === user.id
            // );

            return user.messageIds.map(
                (messageId) => models.messages[messageId]
            );
        }
    }
};

export default userResolvers;
