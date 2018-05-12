import { Schema, model } from 'mongoose';

let schema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });

export default model('Publication', schema);