import * as jwt from "jwt-simple";
import * as passport from "passport";
import * as moment from "moment";
import { Strategy, ExtractJwt } from "passport-jwt";
import { model as User, IUser } from "../models/user.model";

class Auth {

    public initialize = () => {
        passport.use("jwt", this.getStrategy());
        return passport.initialize();
    };

    public authenticate = (callback) => passport.authenticate("jwt", { session: false, failWithError: true }, callback);

    private genToken = (user: IUser): Object => {
        let expires = moment().utc().add({ days: 7 }).unix();
        let token = jwt.encode({
            exp: expires,
            username: user.username
        }, process.env.JWT_SECRET);

        return {
            token: "JWT " + token,
            expires: moment.unix(expires).format(),
            user: user._id
        };
    };

    public isAuthenticated = async (req, res, next) => {
        return this.authenticate((err, user, info) => {
            if (err) { return next(err); }
            if (!user) {
                if (info.name === "TokenExpiredError") {
                    return res.status(401).json({ message: "Your token has expired. Please generate a new one" });
                } else {
                    return res.status(401).json({ message: info.message });
                }
            }
            res.locals.user = user;
            return next();
        })(req, res, next);
    };

    public login = async (req, res) => {
        try {
            req.checkBody("username", "Invalid username").notEmpty();
            req.checkBody("password", "Invalid password").notEmpty();

            let errors = req.validationErrors();
            if (errors) throw errors;

            let user = await User.findOne({ "username": req.body.username.trim() }).exec();

            if (user === null) throw "User not found";

            let success = await user.comparePassword(req.body.password);
            if (success === false) throw "";

            res.status(200).json(this.genToken(user));
        } catch (err) {
            res.status(401).json({ "message": "Invalid credentials", "errors": err });
        }
    };

    public register = async (req, res) => {
        try {
            req.checkBody("username", "Invalid username").notEmpty();
            req.checkBody("email", "Invalid email").notEmpty().isEmail();
            req.checkBody("password", "Invalid password").notEmpty();
            req.checkBody("firstName", "Invalid first name").notEmpty();
            req.checkBody("lastName", "Invalid last name").notEmpty();
            req.checkBody("birthdate", "Invalid birthdate").notEmpty();
            req.checkBody("city", "Invalid city").notEmpty();
            req.checkBody("country", "Invalid country").notEmpty();

            let errors = req.validationErrors();

            if (errors) throw errors;

            let user = await User.findOne({ "username": req.body.username.trim() }).exec();

            if (user !== null) throw "Username is taken";

            user = await User.findOne({ "email": req.body.email.trim() }).exec();

            if (user !== null) throw "Email is taken";

            user = new User(req.body);

            await user.save();

            res.status(200).json({"message": "User registered"});
        } catch (err) {
            res.status(401).json({ "message": "Invalid credentials", "errors": err });
        }
    };

    private getStrategy = (): Strategy => {
        const params = {
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
            passReqToCallback: true
        };

        return new Strategy(params, (req, payload: any, done) => {
            User.findOne({ "username": payload.username }, (err, user) => {
                /* istanbul ignore next: passport response */
                if (err) {
                    return done(err);
                }
                /* istanbul ignore next: passport response */
                if (user === null) {
                    return done(null, false, { message: "The user in the token was not found" });
                }

                return done(null, { _id: user._id, username: user.username });
            });
        });
    }

}

export default new Auth();