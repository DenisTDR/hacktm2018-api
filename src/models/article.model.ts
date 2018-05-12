import { Schema, model } from 'mongoose';
import Publication from './publication.model';
import * as bcrypt from "bcryptjs";
import EthApiService from "./../services/eth-api.service";

let schema: Schema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    articleBody: {
        type: String,
        required: true,
        trim: true
    },
    articleLead: {
        type: String,
        trim: true
    },
    url: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    thumbnail: {
        type: String,
        trim: true
    },
    date: {
        type: Date,
        required: true
    },
    publication: {
        type: Schema.Types.ObjectId,
        ref: 'Publication',
        required: true
    },
    ethAddress: {
        type: String
    }
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });

schema.pre("save", function (next) {
    bcrypt.hash(this.title + this.articleBody + this.articleLead, 10, async (err, hash) => {
        try {
            let response = await EthApiService.createArticle(hash);
            
            this.ethAddress = response.model.ethAddress;

            next();
        } catch (err) {
            next(err);
        }
    });
});

export default model('Article', schema);