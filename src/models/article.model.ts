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
    content: {
        type: String,
        required: true,
        trim: true
    },
    url: {
        type: String,
        required: true,
        unique: true,
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
    }
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });

schema.pre("save", function (next) {
    bcrypt.hash(this.title + this.content, 10, async (err, hash) => {
        try {
            await EthApiService.createArticle(hash);

            next();
        } catch (err) {
            next(err);
        }
    });
});

export default model('Article', schema);