import Sequelize from "sequelize";
import { user } from "./user";
import { message } from "./message";

const sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    {
        dialect: "postgres"
    }
);

console.log(process.env.DATABASE);

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
