const express = require('express');
const multer = require('multer')
const router = express.Router();
const mongoose = require('mongoose')
const User = require('../models/User.js')
const bcrypt = require('bcryptjs')

const storage = multer.diskStorage({
  destination: (req, file, callback) => callback(null, './uploads'),
  filename: (req, file, callback) => callback(null, file.originalname)
})
const upload = multer({ storage })


router.get('/', (req, res) => {
  try {
    User.find().then((users) => {
      res.json(users)
    })
  } catch (err) {
    console.error(err);
  }
})

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ userEmail: req.body.userEmail })
    if (user) {
      res.json(user)
    } else {
      res.status(404).json({ statusText: 'login failed' })
    }
  } catch (err) {
    console.error(err);
  }
})

router.post('/register', upload.single(), async (req, res) => {
  try {
    const email = await User.find({ userEmail: req.body.userEmail })
    if (email.length > 0) {
      res.status(404).json(email)
    } else {
      User.create(req.body).then((users) => {
        res.json(users)
      })
    }
  } catch (err) {
    console.error(err);
  }

})

router.get('/:id', (req, res) => {
  try {
    User.findById(req.params.id).then((users) => {
      res.json(users)
    })
  } catch (err) {
    console.error(err);
  }
})

router.put('/update/:id', (req, res) => {
  try {
    console.log(req.body);
    User.findByIdAndUpdate(req.params.id, req.body, { new: true }).then((users) => {
      res.json(users)
    })
  } catch (err) {
    console.error(err);
  }
})

router.put('/loginstatus/:id', async (req, res) => {
  try {
    const oldStatus = null
    await User.findById(req.params.id).then((users) => {
      oldStatus = users.statusLogin
    })
    if (oldStatus === req.body.statusLogin) {
      res.status(200).json('still login')
    } else {
      await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).then((users) => {
        res.status(404).json(users)
      })
    }
  } catch (err) {
    console.error(err);
  }
})

router.delete('/:id', (req, res) => {
  try {
    User.findByIdAndDelete(req.params.id).then((users) => {
      res.json(users);
    })
  } catch (err) {
    console.error(err);
  }
})
module.exports = router;
