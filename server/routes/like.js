const express = require('express');
const router = express.Router();
const { Like } = require("../models/Like");
const { Video } = require("../models/Video");
const { LiveVideo } = require("../models/LiveVideo");

//=================================
//             Like
//=================================

/* video */
router.post("/getLikes", (req, res) => {
    
    let variable = {}
    if (req.body.videoId) {
        variable = { videoId: req.body.videoId }
    } else {
        variable = { commentId: req.body.commentId }
    }
    Like.find(variable)
        .exec((err, likes) => {
            if (err) return res.status(400).send(err)
            return res.status(200).json({ success: true, likes })
        })
});

router.post("/insertLikes", (req, res) => {
    const newLike = new Like(req.body)

    newLike.save((err, like) => {
        if (err) return res.json({ success: false, err })
        if (req.body.videoId) {
            Video.findOne({ _id: req.body.videoId })
                .exec((err, video) => {
                    if (err) res.status(400).send(err)
                        video.updateOne({ likes: video.likes + 1 })
                            .exec((err, doc) => {
                                if (err) res.status(400).send(err)
                                return res.status(200).json({ success: true })
                            })
                })
        } else {
            res.status(200).json({ success: true })
        }
    })    
});

router.post("/deleteLikes", (req, res) => {
    let variable = {}
    if (req.body.videoId) {
        variable = { videoId: req.body.videoId, userId: req.body.userId }
        Video.findOne({ _id: req.body.videoId })
                .exec((err, video) => {
                    if (err) res.status(400).send(err)
                        video.updateOne({ likes: video.likes - 1 })
                            .exec((err, doc) => {
                                if (err) res.status(400).send(err)
                            })
                })
    } else {
        variable = { commentId: req.body.commentId, userId: req.body.userId }
    }
    Like.findOneAndDelete(variable)
        .exec((err, doc) => {
            if (err) return res.json({ success: false, err })
            res.status(200).json({ success: true }) 
        })
});

/* liveVideo */
router.post("/getLiveLikes", (req, res) => {
    
    let variable = { videoId: req.body.videoId }
    Like.find(variable)
        .exec((err, likes) => {
            if (err) return res.status(400).send(err)
            return res.status(200).json({ success: true, likes })
        })
});

router.post("/insertLiveLikes", (req, res) => {
    const newLike = new Like(req.body)

    newLike.save((err, like) => {
        if (err) return res.json({ success: false, err })
        LiveVideo.findOne({ _id: req.body.videoId })
            .exec((err, live) => {
                if (err) res.status(400).send(err)
                    live.updateOne({ likes: live.likes + 1 })
                        .exec((err, doc) => {
                            if (err) res.status(400).send(err)
                            return res.status(200).json({ success: true })
                        })
            })
    })    
});

router.post("/deleteLiveLikes", (req, res) => {
    let variable = { videoId: req.body.videoId, userId: req.body.userId }
    LiveVideo.findOne({ _id: req.body.videoId })
                .exec((err, live) => {
                    if (err) res.status(400).send(err)
                        live.updateOne({ likes: live.likes - 1 })
                            .exec((err, doc) => {
                                if (err) res.status(400).send(err)
                            })
                })
   
    Like.findOneAndDelete(variable)
        .exec((err, doc) => {
            if (err) return res.json({ success: false, err })
            res.status(200).json({ success: true }) 
        })
});

module.exports = router;
