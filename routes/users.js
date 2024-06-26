const express = require('express');
const multer = require('multer')
const router = express.Router();
const mongoose = require('mongoose')
const User = require('../models/User.js')
const storage = multer.diskStorage({
  destination: (req, file, callback) => callback(null, './uploads'),
  filename: (req, file, callback) => callback(null, file.originalname)
})
const upload = multer({ storage })


router.get('/', (req, res) => {
  User.find().then((users) => {
    res.json(users)
  }).catch((err) => {
    console.error(err);
  })
})

router.post('/', upload.single(), (req, res) => {
  req.body.userImage = req.file.filename
  User.create(req.body).then((users) => {
    res.json(users)
  }).catch((err) => {
    console.error(err);
  })
})

router.get('/:id', (req, res) => {
  User.findById(req.params.id).then((users) => {
    res.json(users)
  }).catch((err) => {
    console.error(err)
  })
})

router.put('/update/:id', (req, res) => {
  console.log(req.body);
  User.findByIdAndUpdate(req.params.id, req.body, { new: true }).then((users) => {
    res.json(users)
  }).catch((err) => {
    console.error(err);
  })
})

router.delete('/:id', (req, res) => {
  User.findByIdAndDelete(req.params.id).then((users) => {
    res.json(users);
  }).catch((err) => {
    console.error(err);
  })
})
module.exports = router;
