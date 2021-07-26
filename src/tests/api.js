import axios from "axios";

class UserApi {
    constructor() {
        this.url = "http://localhost:8000/graphql";
    }

    async getUser(variables) {
        return axios.post(this.url, {
            query: `
                query ($id: ID!) {
                    user(id: $id) {
                        id
                        username
                        email
                        role
                    }
                }
            `,
            variables
        });
    }

    async signIn(variables) {
        return axios.post(this.url, {
            query: `
                mutation ($login: String!, $password: String!) {
                    signIn(login: $login, password: $password) {
                        token
                    }
                }
            `,
            variables
        });
    }

    async deleteUser(variables, token) {
        console.log("Delete me");
        return axios.post(
            this.url,
            {
                query: `
                    mutation ($id: ID!) {
                        deleteUser(id: $id)
                    }
            `,
                variables
            },
            {
                headers: {
                    "x-token": token,
                    "Content-Type": "application/json"
                }
            }
        );
    }
}

export default UserApi;
