const express = require('express')
require('./db/mongoose.js')
const Task = require('./models/task.js')
const userRouter = require('../src/routers/user.js')
const taskRouter = require('../src/routers/task.js')
const app = express()

const port = process.env.PORT

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

// server Loading on port
app.listen(port, () => {
    console.log("Server is up on port :", port)
})