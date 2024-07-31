const express = require('express');
const multer = require('multer')
const router = express.Router();
const mongoose = require('mongoose')
const Posts = require('../models/Posts')
const fs = require('fs');
const authenticateToken = require('../middleware/authenticate');

const storage = multer.diskStorage({
  destination: (req, file, callback) => callback(null, './uploads'),
  filename: (req, file, callback) => callback(null, file.originalname)
})
const upload = multer({ storage })

router.get('/', authenticateToken, async (req, res) => {
  try {
    await Posts.find().then((post) => {
      res.json(post.reverse())
    })
  } catch (err) {
    console.error(err);
  }
})

router.post('/', authenticateToken, async (req, res) => {
  try {
    await Posts.create(req.body).then((post) => {
      res.json(post)
    });
  } catch (err) {
    console.error(err);
  }
})

router.delete('/delete/:id', authenticateToken, async (req, res) => {
  try {
    await Posts.findByIdAndDelete(req.params.id).then((post) => {
      res.json(post)
    })
  } catch (err) {
    console.error(err);
  }
})

module.exports = router