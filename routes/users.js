const express = require('express');
const multer = require('multer')
const router = express.Router();
const mongoose = require('mongoose')
const User = require('../models/User.js')
const bcrypt = require('bcryptjs')
const fs = require('fs')

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

router.post('/register', async (req, res) => {
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

router.get('/finduser/:id', (req, res) => {
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


router.put('/updatePic/:id', upload.single('image'), async (req, res) => {
  try {
    console.log(req.file);
    if (req.file.filename != '' || req.file.filename != null) {
      req.body.image = req.file.filename
    } else {
      res.json(404, req.body)
    }

    const users = await User.findById(req.params.id)
    if (users.image != req.file.filename) {
      await fs.unlink('./uploads/' + users.image, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log('remove img success');
        }
      })
    }

    await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).then((user) => {
      res.json(user)
    })

  } catch (err) {
    console.error(err);
  }
})

router.put('/deleteProfilePic/:id', async (req, res) => {
  try {
    req.body.image = ''
    const users = await User.findById(req.params.id)
    await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).then((user) => {
      res.json(user)
    })
    await fs.unlink('./uploads/' + users.image, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('remove img success');
      }
    })
  } catch (err) {
    console.error(err);
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const users = await User.findById(req.params.id)
    await User.findByIdAndDelete(req.params.id).exec().then((users) => {
      res.json(users);
    })
    await fs.unlink('./uploads/' + users.image, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('remove success');
      }
    })
  } catch (err) {
    console.error(err);
  }
})
module.exports = router;
