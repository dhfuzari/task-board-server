const express = require('express');
const authMiddleware = require('../middlewears/auth');

const Project = require('../models/project');
const Task = require('../models/task');

const router = express.Router();
router.use(authMiddleware);

router.get('/', async (req, res) => {
    try {
        const projects = Project.find();
        
        return res.status(200).send({ projects });
    } catch(err) {
        console.log(err)
        return res.status(400).send({ error: 'Error loading projects list' })
    }
});

router.get('/:projectId', async (req, res) => {
    try {
        res.status(200).send({ userId: req.userId });
    } catch(err) {
        return res.status(400).send({ error: 'Error' })
    }
});

router.post('/', async (req, res) => {
    try {
        const project = await Project.create({user: req.userId, ...req.body});
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
        res.status(200).send({ userId: req.userId });
    } catch(err) {
        return res.status(400).send({ error: 'Error' })
    }
});

module.exports = app => app.use('/projects', router);