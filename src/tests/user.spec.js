import { expect } from "chai";
import UserApi from "./api";

describe("users", () => {
    let userApi = new UserApi();
    describe("user(id: String!): User", () => {
        it("returns a user when user can be found", async () => {
            const expectedResult = {
                data: {
                    user: {
                        id: "1",
                        username: "ali",
                        email: "hello@ali.com",
                        role: "ADMIN"
                    }
                }
            };

            const result = await userApi.getUser({ id: "1" });
            expect(result.data).to.eql(expectedResult);
        });

        it("returns null whan user does not exist", async () => {
            const expectedResult = {
                data: {
                    user: null
                }
            };

            const result = await userApi.getUser({ id: "42" });
            expect(result.data).to.eql(expectedResult);
        });
    });

    describe("deleteUser(id: String!): Boolean!", () => {
        it("returns an error because only admins can delete a user", async () => {
            const {
                data: {
                    data: {
                        signIn: { token }
                    }
                }
            } = await userApi.signIn({
                login: "sultan",
                password: "password1234"
            });

            const {
                data: { errors }
            } = await userApi.deleteUser({ id: 1 }, token);

            expect(errors[0].message).to.eql("Not authorized as Admin");
        });
    });
});
