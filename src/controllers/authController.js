const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json')
const User = require('../models/user');

const router = express.Router();

router.post('/register', async(req, res) => {
    const { email } = req.body;
    try {
        if(await User.findOne({ email }))
            return res.status(400).send({ error: 'User already exists'});

        const user = await User.create(req.body);
        user.password = undefined;

        return res.send({user})
    } catch(err) {
        return res.status(400).send({error: 'Registration failed'});
    }
});

router.post('/authenticate', async(req, res) => {
    const { email, password } = req.body;

    // Get email and password from mongoose. '+password' ask to mongoose get 
    // password key/value from mongodb, wich is selected as select:false'
    const user = await User.findOne({ email }).select('+password');

    if(!user) 
        return res.status(400).send({error: 'User not found'});
    if(!await bcrypt.compare(password, user.password)) // bcrypt.compare returns a promise
        return res.status(400).send({error: 'Invalid password'});
    
    user.password = undefined;

    const token = jwt.sign({ id: user.id }, authConfig.secret, {
        expiresIn: 86400
    })

    return res.status(200).send({ user, token }); 
})

module.exports = app => app.use('/auth', router);

