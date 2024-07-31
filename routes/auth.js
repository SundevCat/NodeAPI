const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticate');

router.get('/', authenticateToken, (req, res) => {
    res.json({ messenge: 'Autherication successful' });
})


module.exports = router;