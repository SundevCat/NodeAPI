const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const ImageDetails = require('../models/ImageDetails')


router.get('/', (req, res) => {
    ImageDetails.find().then((image) => {
        res.json(image)
    }).catch((err) => {
        console.error(err)
    })
})

router.post('/upload-image', async (req, res) => {
    if (req.body.image != "" || req.body.image != null) {
        await ImageDetails.create(req.body).then((image) => {
            res.json(image)
        }).catch((err) => {
            console.error(err);
        })
    }else{
        return res.send({status:'404'});
    }
})

router.get('/:id', (req, res) => {
    ImageDetails.findById(req.params.id).then((product) => {
        res.json(product)
    }).catch((err) => {
        console.error(err);
    })
})


router.put('/:id', (req, res) => {
    ImageDetails.findByIdAndUpdate(req.params.id, req.body).then((product) => {
        res.json(product)
    }).catch((err) => {
        console.error(err);
    })
})

router.delete('/:id', (req, res) => {
    ImageDetails.findByIdAndDelete(req.params.id).then((product) => {
        res.json(product)
    }).catch((err) => {
        console.error(err);
    })
})

module.exports = router;