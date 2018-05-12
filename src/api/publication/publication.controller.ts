import {Request, Response, NextFunction, Router} from 'express';
import Publication from '../../models/publication.model';

export default class PublicationController {

    public router: Router;


    public initAndGetRouter(): Router {
        this.router = Router();
        this.router.get('/', PublicationController.getAll);

        return this.router;
    }

    /**
     * Get all
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    public static async getAll(req: Request, res: Response, next: NextFunction) {

        try {
            // 
            // Get data

            let result = await Publication.find().exec();

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
                message: 'Could not get publications',
                err: err
            });
        }
    }

}