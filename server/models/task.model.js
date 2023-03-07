const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taskSchema = new Schema({
    title: {type: String, required: true},
    subTasks: { type: [{
        sub_title: {type: String},
        link: {type: String},
        icon_url: {type: String},
        sub_completed: {type: Boolean, required: true}
    }]},
    note: {type: String},
    date: {type: Date, required: true},
    completed: {type: Boolean, required: true}
}, {
    timestamps: true
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;