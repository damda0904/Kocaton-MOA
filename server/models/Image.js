const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = mongoose.Schema({

    writer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        maxlength: 50
    },
    description: {
        type: String
    },
    filePath: [{
        type: String
    }],
    fileName:[{
        type:String
    }],
    category: {
        type: String
    },
    views: {
        type: Number,
        default: 0
    },
    introduction:{
        type:String,
    },
    likes: {
        type: Number,
        default: 0
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date
    },
    tags: [{
        type: String
    }]
}, { timestamps: true })

const Image = mongoose.model('Image', imageSchema);

module.exports = { Image }
