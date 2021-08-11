import mongoose from "mongoose";

const designSchema = new mongoose.Schema({
    shape: String,
    colors: [],
    name: String,
    user: String,
    createdAt: {
        type: Date,
        default: new Date()
    }
})

const design = mongoose.model('design', designSchema)
export default design;