import Sequelize from "sequelize";
import { user } from "./user";
import { message } from "./message";

let sequelize;

if (process.env.DATABASE_URL) {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: "postgres"
    });
} else {
    sequelize = new Sequelize(
        process.env.TEST_DATABASE || process.env.DATABASE,
        process.env.DATABASE_USER,
        process.env.DATABASE_PASSWORD,
        {
            dialect: "postgres"
        }
    );
}

const models = {
    User: user(sequelize, Sequelize),
    Message: message(sequelize, Sequelize)
};

Object.keys(models).forEach((key) => {
    if ("associate" in models[key]) {
        models[key].associate(models);
    }
});

export default models;

export { sequelize };
