const express = require('express');
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const app = express();
require('dotenv').config()

//since import is used add .js extension as well
const evaluatorRouter = require('./routes/evaluator')
const reviewerRouter = require('./routes/reviewer')
const selfRouter = require('./routes/selfappr')
const hrRouter = require('./routes/hr')

const cors = require("cors");
app.use(express.json());
app.use(cors());

app.use("/evaluator", evaluatorRouter);
app.use("/reviewer", reviewerRouter);
app.use("/self", selfRouter);
app.use("/hr", hrRouter);

//console.log(process.env.url)
mongoose.connect(process.env.url);

app.listen(3005, () => {
    console.log('Server started on port 3005');
});