const express = require('express');
const authMiddleware = require('../middlewears/auth');

const Project = require('../models/project');
const Task = require('../models/task');

const router = express.Router();
router.use(authMiddleware);

router.get('/', async (req, res) => {
    res.status(200).send({ userId: req.userId });
});

router.get('/:projectId', async (req, res) => {
    res.status(200).send({ userId: req.userId });
});

router.post('/', async (req, res) => {
    res.status(200).send({ userId: req.userId })
})

router.put('/:projectId', async (req, res) => {
    res.status(200).send({ userId: req.userId });
});

router.delete('/:projectId', async (req, res) => {
    res.status(200).send({ userId: req.userId });
});

module.exports = app => app.use('/projects', router);