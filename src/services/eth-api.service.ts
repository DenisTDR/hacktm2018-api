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

    public static async vote(value: Boolean, articleId: String, userId: String) {
        return true;

        // return requestPromise({
        //     method: 'POST',
        //     body: {
        //         value: value,
        //         article: articleId,
        //         user: userId
        //     },
        //     uri: process.env.ETH_API_BASE + '/eth/vote',
        //     json: true
        // });
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
        }).then((response) => {
            console.log("res body> ", response.body);
            return response.body;
        })
    }
}