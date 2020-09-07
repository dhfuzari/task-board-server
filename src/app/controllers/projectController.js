const express = require('express');
const authMiddleware = require('../middlewears/auth');

const Project = require('../models/project');
const Task = require('../models/task');

const router = express.Router();
router.use(authMiddleware);

router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().populate('user');
        return res.status(200).send({ projects });
    } catch(err) {
        return res.status(400).send({ error: 'Error loading projects list' })
    }
});

router.get('/:projectId', async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId).populate('user');
        res.status(200).send({ project });
    } catch(err) {
        return res.status(400).send({ error: 'Error loading project by Id' })
    }
});

router.post('/', async (req, res) => {
    try {
        const project = await Project.create({ ...req.body, user: req.userId });
        return res.status(200).send({ project });
    } catch(err) {
        console.log(err)
        return res.status(400).send({ error: 'Error creating new project' })
    }
})

router.put('/:projectId', async (req, res) => {
    try {
        res.status(200).send({ userId: req.userId });
    } catch(err) {
        return res.status(400).send({ error: 'Error' })
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