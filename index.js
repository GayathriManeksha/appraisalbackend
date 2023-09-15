const express = require('express');
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const app = express();
require('dotenv').config()
app.use(express.json());
const cors = require("cors");

app.use(cors());
//since import is used add .js extension as well
const loginRouter = require('./routes/login')
const evaluatorRouter = require('./routes/evaluator')
const reviewerRouter = require('./routes/reviewer')
const selfRouter = require('./routes/selfappr')
const hrRouter = require('./routes/hr')
const finalRouter = require('./routes/finalsubmit')
const statusRouter = require('./routes/statusvalue')
const feedbackRouter = require('./routes/feedback')
const performanceappraisalRouter = require('./routes/performanceappraisal')
const recommendationRouter = require('./routes/recommendations')
const summaryRouter = require('./routes/summary')



const secretKey = 'your-secret-key';

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        console.log(token)
        const decoded = jwt.verify(token.split(' ')[1], 'your-secret-key');
        console.log(decoded)
        req.userid = decoded.userId; // Attach the user data from the token to the request object
        next(); // Proceed to the next middleware
    } catch (error) {
        return res.status(400).json({ error: 'Invalid token.' });
    }
};

app.use("/", loginRouter);
app.use("/evaluator", verifyToken, evaluatorRouter);
app.use("/reviewer", verifyToken, reviewerRouter);
app.use("/self", verifyToken, selfRouter);
app.use("/hr", verifyToken, hrRouter);
app.use("/finalsubmit", verifyToken, finalRouter);
app.use("/status", verifyToken, statusRouter);
app.use("/summary", verifyToken, summaryRouter);
app.use("/recommendations", verifyToken, recommendationRouter);
app.use("/performanceappraisal", verifyToken, performanceappraisalRouter);
app.use("/feedbackRouter",verifyToken, feedbackRouter);


console.log(process.env.url)
mongoose.connect(process.env.MONGODB_URI);


app.listen(3007, () => {
    console.log('Server started on port 3005');
});