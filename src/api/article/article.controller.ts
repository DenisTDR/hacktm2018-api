import {Request, Response, NextFunction, Router} from 'express';
import Article from '../../models/article.model';
import Publication from '../../models/publication.model';

export default class ArticleController {

    public router: Router;


    public initAndGetRouter(): Router {
        this.router = Router();
        this.router.get('/', ArticleController.get);
        this.router.post('/', ArticleController.create);

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

            let result = await Article.find(req.query).populate({
                path: 'publication',
                model: Publication
            }).exec();

            // 
            // Response
            res.send({
                message: 'it works!',
                result: result
            });
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

            // Create model
            let model = new Article({
                title: req.body.title,
                articleBody: req.body.articleBody,
                articleLead: req.body.articleLead,
                thumbnail: req.body.thumbnail,
                url: req.body.url.toLowerCase(),
                date: req.body.date,
                publication: req.body.publicationId
            });

            //
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
}