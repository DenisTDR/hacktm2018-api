import * as requestPromise from "request-promise";

export default class EthApiService {

    public static async createAcccount(password: String) {
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
}