const express = require('express');
const authMiddleware = require('../middlewears/auth');
const Project = require('../models/project');

const Task = require('../models/task');

const router = express.Router();
router.use(authMiddleware);

router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        return res.status(200).send({ tasks });
    } catch(err) {
        return res.status(400).send({ error: 'Error loading tasks list' });
    }
});

module.exports = app => app.use('/tasks', router);