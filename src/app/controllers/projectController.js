const express = require('express');
const authMiddleware = require('../middlewears/auth');

const Project = require('../models/project');
const Task = require('../models/task');

const router = express.Router();
router.use(authMiddleware);

router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().populate('user'); // populate method returns the full 'user' object
        return res.status(200).send({ projects });
    } catch(err) {
        return res.status(400).send({ error: 'Error loading projects list' })
    }
});

router.get('/:projectId', async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId).populate(['user', 'tasks']);
        res.status(200).send({ project });
    } catch(err) {
        return res.status(400).send({ error: 'Error loading project by Id' })
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, description, tasks } = req.body;
        const project = await Project.create({ title, description, user: req.userId });

        await Promise.all(tasks.map(async task => {
            const projectTask = new Task({ ...task, project: project._id});
            await projectTask.save();
            project.tasks.push(projectTask);
        }));
        await project.save();
        return res.status(200).send({ project });
    } catch(err) {
        console.log(err)
        return res.status(400).send({ error: 'Error creating new project' })
    }
})

router.put('/:projectId', async (req, res) => {
    try {
        const { title, description, tasks } = req.body;
        const project = await Project.findByIdAndUpdate(req.params.projectId, { 
            title, 
            description, 
            user: req.userId 
        }, { new: true }); // "{ new: true }" config param returns the new object updated by fundByIdAndUpdate function

        project.tasks = [];
        await Task.remove({ project: project._id });

        await Promise.all(tasks.map(async task => {
            const projectTask = new Task({ ...task, project: project._id});
            await projectTask.save();
            project.tasks.push(projectTask);
        }));
        await project.save();
        return res.status(200).send({ project });
    } catch(err) {
        console.log(err)
        return res.status(400).send({ error: 'Error updating new project' })
    }
});

router.delete('/:projectId', async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await Project.findByIdAndRemove(projectId);
        res.status(200).send({ message: `Project ${projectId} removed` });
    } catch(err) {
        return res.status(400).send({ error: 'Error' })
    }
});

module.exports = app => app.use('/projects', router);