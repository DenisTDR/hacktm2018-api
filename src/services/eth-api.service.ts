import * as requestPromise from "request-promise";

export default class EthApiService {

    public static async createAcccount(password: String) {
        return true;
        // return requestPromise({
        //     method: 'POST',
        //     body: {
        //         password: password
        //     },
        //     uri: process.env.ETH_API_BASE + '/eth/createAccount',
        //     json: true
        // });
    }

    public static async createArticle(articleHash: String) {
        return true;
        // return requestPromise({
        //     method: 'POST',
        //     body: {
        //         hash: articleHash
        //     },
        //     uri: process.env.ETH_API_BASE + '/article/new',
        //     json: true
        // });
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
}