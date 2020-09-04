const express = require('express');
const authMiddleware = require('../middlewears/auth');

const router = express.Router();
router.use(authMiddleware);

router.get('/', (req, res) => {
    res.status(200).send({ authenticated: true, userId: req.userId });
});

module.exports = app => app.use('/projects', router);