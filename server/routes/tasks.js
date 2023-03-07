const router = require('express').Router();

let Task = require('../models/task.model');

router.get('/', async (req, res) => {
    await Task.find()
        .then(tasks => res.json(tasks))
        .catch(err => res.status(400).json(`Error: ${err}`));
});

router.post('/add', async (req, res) => {
    const title = req.body.title;
    const subTasks = req.body.subTasks;
    const note = req.body.note;
    const date = Date.parse(req. body.date);
    const completed = req.body.completed;

    if (!title)
        return res
            .status(400)
            .json({msg: "Title not found!"});
    
    const newTask = new Task({
        title,
        subTasks,
        note,
        date,
        completed
    });

    await newTask.save()
        .then(() => res.json(newTask))
        .catch(err => res.status(400).json(`Error: ${err}`));
});

router.delete('/delete/:id', async (req, res) => {
    const task = await Task.findOne({_id: req.params.id});
    if (!task)
        return res
            .status(400)
            .json({msg: "No Task Found!"});
    
    await Task.findByIdAndDelete(req.params.id)
        .then(() => res.json("Task Deleted!"))
        .catch(err => res.status(400).json(`Error: ${err}`));
});

router.post('/update/:id', async (req, res) => {
    await Task.findById({_id: req.params.id})
        .then(task => {
            task.title = req.body.title,
            task.subTasks = req.body.subTasks,
            task.note = req.body.note;
            task.date = Date.parse(req.body.date);
            task.completed = req.body.completed;

            task.save()
                .then(() => res.json('Task Updated!'))
                .catch(err => res.status(400).json(`Error ${err}`))
        })
        .catch(err => res.status(400).json(`Error: ${err}`))
})

module.exports = router; 