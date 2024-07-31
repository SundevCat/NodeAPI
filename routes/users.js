const express = require('express');
const multer = require('multer');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User.js');
const cookieParser = require('cookie-parser')
const fs = require('fs');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/authenticate.js');

const storage = multer.diskStorage({
  destination: (req, file, callback) => callback(null, './uploads'),
  filename: (req, file, callback) => callback(null, file.originalname)
})
const upload = multer({ storage })
const secret = 'EiKf9vBVMW0Qiu6EWgzwU7PyCdD0BLxv7ks4kTe4fXvGPDYsS3QT3wugV4ReGopt'

router.get('/', authenticateToken, async (req, res) => {
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
      bcrypt.compare(req.body.password, user.password, async (err, match) => {
        if (!match) {
          res.status(400).json({
            message: 'login failed (wrong email, password)'
          })
          return false
        }
        //สร้าง token jwt token  
        const token = jwt.sign({ id: user._id, username: user.userName }, secret, { expiresIn: '8h' })
        // res.cookie('token', token, {
        //   secure: true,
        //   httpOnly: true,
        // })
        res.json(token)
      })
    } else {
      res.status(400).json({ message: 'login failed (wrong email, password)' })
    }
  } catch (err) {
    console.error(err);
  }
})

router.post('/register', async (req, res) => {
  try {
    const email = await User.find({ userEmail: req.body.userEmail })
    console.log(email);
    if (email.length > 0) {
      res.status(409).json({ message: 'email already exists' })
    } else {
      User.create(req.body).then((users) => {
        const token = jwt.sign({ id: users._id, username: users.userName }, secret, { expiresIn: '8h' })
        res.json(token)
      })
    }
  } catch (err) {
    console.error(err);
  }

})

router.get('/finduser/:id', authenticateToken, async (req, res) => {
  try {
    await User.findById(req.params.id).then((users) => {
      res.json(users)
    })
  } catch (err) {
    console.error(err);
  }
})

router.get('/finduserpost/:id', authenticateToken, async (req, res) => {
  try {
    await User.findById(req.params.id).then((users) => {

      const mapData = {
        userName: users.userName,
        userLastName: users.userLastName,
        image: users.image,
      }
      res.json(mapData)

    })
  } catch (err) {
    console.error(err);
  }
})


router.put('/update/:id', authenticateToken, (req, res) => {
  try {
    console.log(req.body);
    User.findByIdAndUpdate(req.params.id, req.body, { new: true }).then((users) => {
      res.json(users)
    })
  } catch (err) {
    console.error(err);
  }
})


router.put('/updatePic/:id', authenticateToken, upload.single('image'), async (req, res) => {
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


router.put('/updateCoverPhoto/:id', authenticateToken, upload.single('CoverPhoto'), async (req, res) => {
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

router.put('/deleteProfilePic/:id', authenticateToken, async (req, res) => {
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

router.put('/deleteCoverPhoto/:id', authenticateToken, async (req, res) => {
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

router.delete('/:id', authenticateToken, async (req, res) => {
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
