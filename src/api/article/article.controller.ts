import {Request, Response, NextFunction, Router} from 'express';
import Publication from '../../models/publication.model';
import EthApiService from "../../services/eth-api.service";
import ArticleCrawler from '../../services/article-crawler.service';
import Article from '../../models/article.model';

export default class ArticleController {

    public router: Router;


    public initAndGetRouter(): Router {
        this.router = Router();
        this.router.get('/', ArticleController.get);
        this.router.post('/', ArticleController.create);
        this.router.post('/:_id/vote/:value', ArticleController.vote);

        return this.router;
    }

    /**
     * Get all
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    public static async get(req: Request, res: Response, next: NextFunction) {

        try {
            // 
            // Get data

            let articles = await Article.find(req.query).populate({
                path: 'publication',
                model: Publication
            }).exec();

            let promises = articles.map((element: any) => {
                return EthApiService.getArticleValues(element.ethAddress);
            });

            Promise.all(promises)
                .then(results => {
                    let newResults = [];

                    results.forEach((element, index) => {
                        element.status = undefined;
                        newResults.push(Object.assign(articles[index].toObject(), element));
                    });

                    res.send({
                        message: 'it works!',
                        result: newResults
                    });
                })
        } catch (err) {

            // 
            // Error response
            res.send({
                message: 'Could not get articles',
                err: err
            });
        }
    }

    /**
     * Create
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    public static async create(req: Request, res: Response, next: NextFunction) {

        try {
            req.checkBody("url", "Invalid url").notEmpty();

            let errors = req.validationErrors();

            if (errors) throw errors;

            let article = await Article.findOne({"url": req.body.url.trim()}).exec();

            if (article !== null) throw "Article with that url already exists";

            // call scraper

            const ac = new ArticleCrawler(req.body.url.trim());
            let model = await ac.crawl();

            // Save
            await model.save();

            res.send({
                message: 'Created!',
                model: model
            });
        } catch (err) {
            res.status(400).json({ "message": "Invalid data", "errors": err });
        }
    }

    public static async vote(req: Request, res: Response, next: NextFunction) {

        try {
            //
            // Get data

            let article = await Article.findById(req.params._id).exec();

            if (article === null) throw "Article not found";

            if (req.params.value !== 'true' && req.params.value !== 'false') throw "Invalid value, must be true or false";

            //await EthApiService.vote(Boolean(req.params.value), article._id, res.locals.user._id);

            //
            // Response
            res.send({
                message: 'it works!'
            });
        } catch (err) {

            //
            // Error response
            res.send({
                message: 'Could not vote',
                err: err
            });
        }
    }
}
