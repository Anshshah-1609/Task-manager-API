const express = require('express')
const Task = require('../models/task.js')
const auth = require('../middleware/auth.js')
const router = express.Router()

// Task Model
// Creating Task
router.post('/tasks',auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner : req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})
// Reading all Tasks 
// GET /tasks?status=true
// GET /tasks?limit=2
// GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}
    if (req.query.status) {
        match.status = req.query.status === 'true'
    }
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    try {
        await req.user.populate({
            path : 'tasks',
            match,
            options : {
                limit : parseInt(req.query.limit),
                skip : parseInt(req.query.skip),
                sort
            }
        })
        res.status(201).send(req.user.tasks)
    } catch (error) {
        res.status(500).send(error)
    }
})
// Reading task by Id
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        // const task = await Task.findById(_id)
        const task = await Task.findOne({ _id, owner:req.user._id})
        if (!task) {
            return res.status(404).send("Task Does not exist OR you can't Access this Task!!")
        }
        res.send(task)
    } catch (error) {
        res.status(505).send(error)
    }
})
// Updating Task by Id
router.patch('/tasks/:id',auth, async (req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description','status']
    const isValid = updates.every((up) => {
        return allowedUpdates.includes(up)
    })
    if(!isValid){
        return res.status(404).send({Error : "Property does not exist in Task!"})
    }

    try {
        const task = await Task.findOne({ _id : req.params.id, owner:req.user._id})
        
        if (!task){
            return res.status(404).send({ Error : "Task not found OR you can't access it!!"})
        }
        updates.forEach((update) => {
            task[update] = req.body[update]
        })
        await task.save()
        res.send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})
// Delete Task by id 
router.delete('/tasks/:id', auth, async (req,res) => {
    const _id = req.params.id

    try {
        const task = await Task.findByIdAndDelete({_id, owner:req.user._id})
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch(error) {
        res.status(500).send(error)
    }
})

module.exports = router
