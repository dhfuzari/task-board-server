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

router.post('/', async (req, res) => {
    try {
        const { title, project, assignedTo } = req.body;
        const task = new Task({ title, project, assignedTo: req.userId });
        await task.save();
        const projectModel = await Project.findById(project);
        projectModel.tasks.push(task)
        await projectModel.save();

        return res.status(200).send({ task });
    } catch(err) {
        console.log(err);
        return res.status(400).send({ error: 'Error creating new task' });
    }
});

router.put('/:taskId', async (req, res) => {
    try {
        const { title, assignedTo, completed } = req.body;
        const task = await Task.findByIdAndUpdate(req.params.taskId, { 
            title,
            assignedTo, 
            completed
        }, { new: true }); // "{ new: true }" config param returns the new object updated by fundByIdAndUpdate function
        return res.status(200).send({ task });
    } catch(err) {
        console.log(err)
        return res.status(400).send({ error: 'Error updating existing task' });
    }
});

module.exports = app => app.use('/tasks', router);