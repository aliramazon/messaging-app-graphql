let users = {
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

export default {
    users,
    messages
};
