const express = require('express')
const cors = require('cors')

const app = express()
//port
const PORT = 8989
// middleware
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())

const teachersRouter = require('./src/routers/teachersRouter')
const classroomsRouter = require('./src/routers/classroomsRouter');
const studentsRouter = require('./src/routers/studentsRouter')
app.use('/api/teachers',teachersRouter)
app.use('/api/classrooms', classroomsRouter);
app.use('/api/students', studentsRouter);
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})