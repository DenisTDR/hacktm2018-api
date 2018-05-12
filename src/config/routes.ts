import { Router, Request, Response, NextFunction } from 'express';
import ExampleRouter from '../api/example/example.router';
import ThingController from '../api/thing/thing.controller';
import Auth from "../api/auth";
import ArticleController from "../api/article/article.controller";

export default class Routes {

    public router: Router;
    private app;


    /*--------  Constructor  --------*/


    constructor(app) {

        // 
        // Set router
        this.router = Router();

        // 
        // Set app
        this.app = app;

        // 
        // Set all routes
        this.setAllRoutes();
    }


    /*--------  Methods  --------*/


    /**
     * Set all app routes
     */
    setAllRoutes() {


        /*--------  Set all custom routes here  --------*/


        // 
        // Your routes goes here
        this.app.use('/api/examples', ExampleRouter);
        this.app.use('/api/things', new ThingController().initAndGetRouter());
        this.app.use('/api/articles', new ArticleController().initAndGetRouter());
        this.app.post('/api/auth/login', Auth.login);
        this.app.post('/api/auth/register', Auth.register);


        /*--------  Main routes  --------*/


        // 
        // Set main route for any other route found
        this.setMainRoute();
    }

    /**
     * Set main route
     * this route will be used for all other routes not found before
     */
    private setMainRoute() {

        // 
        // All other routes should redirect to the index.html
        this.app.route('/*').get(this.index);
    }

    /**
     * Main route
     */
    private index(req: Request, res: Response, next: NextFunction) {
        res.json({
            message: 'Hello World!'
        });
    }

}