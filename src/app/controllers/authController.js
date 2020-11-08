const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const authConfig = require('../../config/auth.json');
const mailer = require('../../modules/mailer');
const User = require('../models/user');

const router = express.Router();

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400,
  });
}

router.post('/register', async (req, res) => {
  const { email } = req.body;
  try {
    if (await User.findOne({ email })) return res.status(400).send({ error: 'User already exists' });

    const user = await User.create(req.body);
    user.password = undefined;

    return res.send({
      user,
      token: generateToken({ id: user.id }),
    });
  } catch (err) {
    return res.status(400).send({ error: 'Registration failed' });
  }
});

router.post('/authenticate', async (req, res) => {
  const { email, password } = req.body;

  // Get email and password from mongoose. '+password' ask to mongoose get
  // password key/value from mongodb, wich is selected as select:false'
  const user = await User.findOne({ email }).select('+password');

  if (!user) return res.status(400).send({ error: 'User not found' });

  // bcrypt.compare method will return a promise
  if (!await bcrypt.compare(password, user.password)) {
    return res.status(400).send({ error: 'Invalid password' });
  }

  user.password = undefined;

  const token = generateToken({ id: user.id });

  return res.status(200).send({ user, token });
});

router.post('/forgot_password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send({ error: 'User not found' });

    const token = crypto.randomBytes(20).toString('hex');
    const now = new Date();
    now.setHours(now.getHours() + 1);

    await User.findByIdAndUpdate(user.id, {
      $set: {
        passwordResetToken: token,
        passwordResetExpires: now,
      },
    });

    mailer.sendMail({
      from: '"Task Board Crud Api 👻" <email@example.com>',
      to: email,
      subject: 'Hello ✔',
      template: 'auth/forgot-password',
      context: { token },
    }, (err) => {
      if (err) {
        res.status(400).send({ error: 'Cannot send forgot email password' });
      } else {
        res.status(200).send({ message: 'Email successfuly send' });
      }
    });
  } catch (err) {
    res.status(400).send({ error: 'Error on forgot password, try again later' });
  }
});

router.post('/reset_password', async (req, res) => {
  const { email, token, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('passwordResetToken passwordResetExpires');

    if (!user) return res.status(400).send({ error: 'User not found' });

    if (token !== user.passwordResetToken) return res.status(400).send({ error: 'Password reset token is invalid' });

    const now = new Date();
    if (now > user.passwordResetExpires) return res.status(400).send({ error: 'Password reset token expired, generate a new one' });

    user.password = password;
    await user.save();

    res.status(200).send({ message: `User ${email} has password updated` });
  } catch (err) {
    res.status(400).send({ error: 'Cannot reset password, try again later' });
  }
});

module.exports = (app) => app.use('/auth', router);
