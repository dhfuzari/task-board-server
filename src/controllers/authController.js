const express = require('express');
const router = express.Router();

const User = require('../models/user');

router.post('/register', async(req, res) => {
    try {
        const user = await User.create(req.body)
        return res.send({})
    } catch(err) {
        return res.status(400).send({error: 'Registration failed'});
    }
});

module.exports = app => app.use('/auth', router);

