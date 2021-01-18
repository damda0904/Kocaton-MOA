const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const liveVideoSchema = mongoose.Schema({
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
    category: {
        type: String
    },
    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    thumbnail: {
        type: String
    },
    tags: [{
        type: String
    }]
}, { timestamps: true })

const LiveVideo = mongoose.model('LiveVideo', liveVideoSchema);

module.exports = { LiveVideo }