const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/Product.js');

router.get('/', (req, res) => {
    Product.find().then((products) => {
        res.json(products)
    }).catch((err) => {
        console.error(err)
    })
})

router.post('/', (req, res) => {
    Product.create(req.body).then((products) => {
        res.json(products)
    }).catch((err) => {
        console.error(err)
    })
})

router.get('/:id', (req, res) => {
    Product.findById(req.params.id).then((product) => {
        res.json(product)
    }).catch((err) => {
        console.error(err);
    })
})


router.put('/:id', (req, res) => {
    Product.findByIdAndUpdate(req.params.id, req.body).then((product) => {
        res.json(product)
    }).catch((err) => {
        console.error(err);
    })
})

router.delete('/:id', (req, res) => {
    Product.findByIdAndDelete(req.params.id).then((product) => {
        res.json(product)
    }).catch((err) => {
        console.error(err);
    })
})

module.exports = router;