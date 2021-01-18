const express = require('express');
const router = express.Router();
const { LiveVideo } = require('../models/LiveVideo')

const multer = require('multer');

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    }
})

const upload = multer({ storage: storage }).single('file');

//=================================
//             LiveVideo
//=================================

router.post('/uploadfiles', (req, res) => {
    upload(req, res, err => {
        if (err) return res.json({ success: false, err })
        return res.json({ success: true, url: res.req.file.path, fileName: res.req.file.filename })
    })
})

router.post('/uploadLiveInfo', (req, res) => {
    const liveVideo = new LiveVideo(req.body);
    liveVideo.save((err, doc) => {
        if (err) return res.json({ success: false, err })
        return res.status(200).json({ success: true })
    })
})

router.post('/getLiveDetail', (req, res) => {
    LiveVideo.findOne({ "_id": req.body.liveId })
        .populate('writer')
        .exec((err, liveDetail) => {
            if (err) return res.status(400).send(err)
            res.status(200).json({ success: true, liveDetail })
        })
})


router.post('/getLiveDetailByBroadcaster', (req, res) => {
    LiveVideo.findOne().populate({
        path: 'writer',
        match: { _id: req.body.broadcasterId }
    }).exec((err, liveDetail) => {
        if (err) res.json({ success: false, err })
        res.status(200).json({ success: true, liveDetail })
    })
})

router.get('/getliveVidoes', (req, res) => {
    LiveVideo.find()
        .populate('writer')
        .exec((err, liveVideo) => {
            if (err) res.json({ success: false, err })
            res.status(200).json({ success: true, liveVideo })
        })
})

router.post('/removeLiveData', (req, res) => {
    LiveVideo.findOneAndDelete({ writer: req.body.broadcasterId })
        .exec((err, doc) => {
            if (err) res.json({ success: false, err })
            res.status(200).json({ success: true })
        })
})

module.exports = router;
