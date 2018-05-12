import { Schema, model } from 'mongoose';
import Publication from './publication.model';

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

export default model('Article', schema);