import * as requestPromise from "request-promise";

export default class EthApiService {

    public static async createAcccount(password: String) {
        // return true;
        console.log("create account eth api");
        return requestPromise({
            method: 'POST',
            body: {
                password: password
            },
            uri: process.env.ETH_API_BASE + '/eth/createAccount',
            json: true
        });
    }

    public static async createArticle(articleHash: String) {
        console.log("create article eth api");

        return requestPromise({
            method: 'POST',
            body: {
                hash: articleHash
            },
            uri: process.env.ETH_API_BASE + '/article/new',
            json: true,
            resolveWithFullResponse: true
        }).then((response) => response.body);
    }

    public static async vote(value: Boolean,
                             articleAddress: String,
                             userEthAddress: String,
                             userProfileAddress: String,
                             userPassword: String) {
        console.log("vote eth api");


        return requestPromise({
            method: 'POST',
            body: {
                articleAddress: articleAddress,
                vote: value,
                weight: 1.5,
                userProfileAddress: userProfileAddress,
                voterAddress: userEthAddress,
                password: userPassword
            },
            uri: process.env.ETH_API_BASE + '/article/vote',
            json: true
        }).catch((err) => {
            if (err.error.reason === "You already voted for this article") {
                err = { message: "You already voted for this article" }
            }

            throw err;
        });
    }

    public static async getArticleValues(articleAddress: String) {
        console.log("get article values eth api");


        return requestPromise({
            method: 'GET',
            qs: {
                articleAddress: articleAddress
            },
            uri: process.env.ETH_API_BASE + '/article/state',
            json: true,
            resolveWithFullResponse: true
        }).then((response) => response.body);
    }

    public static async voteOf(articleAddress: String, userAddress: String) {
        console.log("get did vote eth api", articleAddress);

        return requestPromise({
            method: 'GET',
            qs: {
                articleAddress: articleAddress,
                voterAddress: userAddress
            },
            uri: process.env.ETH_API_BASE + '/article/voteOf',
            json: true,
            resolveWithFullResponse: true
        }).then((response) => response.body);
    }
}