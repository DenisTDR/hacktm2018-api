import {Request, Response, NextFunction, Router} from 'express';
import User from '../../models/user.model';
import Auth from "../auth";

export default class UserController {

    public router: Router;


    public initAndGetRouter(): Router {
        this.router = Router();
        this.router.get('/me', Auth.isAuthenticated, UserController.getProfile);

        return this.router;
    }

    /**
     * Get all
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    public static async getProfile(req: Request, res: Response, next: NextFunction) {

        try {
            // 
            // Get data

            let result = await User.findById(res.locals.user._id).exec();
            result.password = undefined;

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
                message: 'Could not get profile',
                err: err
            });
        }
    }
}