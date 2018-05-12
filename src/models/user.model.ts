import * as mongoose from "mongoose";
import * as bcrypt from "bcryptjs";
import EthApiService from "./../services/eth-api.service";

export interface IUser extends mongoose.Document {
    username: string;
    password: string;
    validated: boolean;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

export const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    validated: {
        type: Boolean,
        default: false,
        required: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    birthdate: {
        type: Date,
        required: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    country: {
        type: String,
        required: true,
        trim: true
    },
    ethAddress: {
        type: String
    },
    profilePicture: {
        type: String,
        default: "http://www.personalbrandingblog.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640-300x300.png"
    }

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });

schema.pre("save", function (next) {
    bcrypt.hash(this.password, 10, (err, hash) => {
        this.password = hash;
        next();
    });
});

schema.pre("save", async function (next) {
    try {
        let account = await EthApiService.createAcccount(this.password);

        this.ethAddress = account.address;
        next();
    } catch (err) {
        next(err);
    }

});

schema.pre("update", function (next) {
    bcrypt.hash(this.password, 10, (err, hash) => {
        this.password = hash;
        next();
    });
});

schema.methods.comparePassword = function (candidatePassword: string): Promise<boolean> {
    let password = this.password;
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, password, (err, success) => {
            if (err) return reject(err);
            return resolve(success);
        });
    });
};

export const model = mongoose.model<IUser>("User", schema);

export const cleanCollection = () => model.remove({}).exec();

export default model;