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

router.get('/:taskId', async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId).populate(['assignedTo', 'project']); // eager loading assignedTo and project
        res.status(200).send({ task });
    } catch(err) {
        return res.status(400).send({ error: 'Error loading task by Id' });
    }
});

module.exports = app => app.use('/tasks', router);