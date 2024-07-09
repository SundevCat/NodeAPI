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


router.get('/', async (req, res) => {
  try {
    await User.find().then((users) => {
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

router.get('/finduser/:id', async (req, res) => {
  try {
    await User.findById(req.params.id).then((users) => {
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
    if (req.file.filename != '' || req.file.filename != null) {
      req.body.image = req.file.filename

      const users = await User.findById(req.params.id)
      if (users.image != '') {
        fs.unlink('./uploads/' + users.image, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log('remove img success');
          }
        })
      }

      await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).then((user) => res.json(user))

    } else {
      res.json(404, req.body)
    }

  } catch (err) {
    console.error(err);
  }
})


router.put('/updateCoverPhoto/:id', upload.single('CoverPhoto'), async (req, res) => {
  try {
    if (req.file.filename != '' || req.file.filename != null) {
      req.body.cover_photo = req.file.filename

      const users = await User.findById(req.params.id)
      if (users.cover_photo != '') {
        fs.unlink('./uploads/' + users.cover_photo, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log('remove cover photo success');
          }
        })
      }

      await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).then((user) => res.json(user))

    } else {
      res.json(404, req.body)
    }

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
    fs.unlink('./uploads/' + users.image, (err) => {
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

router.put('/deleteCoverPhoto/:id', async (req, res) => {
  try {
    req.body.cover_photo = ''
    const users = await User.findById(req.params.id)
    await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).then((user) => {
      res.json(user)
    })
    fs.unlink('./uploads/' + users.cover_photo, (err) => {
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
