const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true})
    .catch(err => console.log(err));

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB connected!");
});

const taskRouter = require('./routes/tasks');

app.use('/api/task', taskRouter);

app.get('/', (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});