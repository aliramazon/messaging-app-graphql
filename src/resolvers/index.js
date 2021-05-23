import { GraphQLDateTime } from "graphql-iso-date";

import messageResolvers from "./message";
import userResolvers from "./user";

const customScalarResolver = {
    Date: GraphQLDateTime
};

export default [customScalarResolver, userResolvers, messageResolvers];
