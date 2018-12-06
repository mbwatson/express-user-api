const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios')

const userPath = '/'
const port = process.env.NODE_ENV == 'production' ? 80 : 3030

// Connection to DB
mongoose.connect('mongodb://mongodb')
    .then( () => {
        console.log('Database Started')
    })
    .catch( err => {
        console.error('Backend error:', err.stack)
        process.exit(1)
    })

// Routes and Backend Functionalities
const userRoutes = require('./src/routes/UserRoutes')

// App Instance
const app = express()
app.use(express.static('public'))
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(userPath, userRoutes)

// Execute App
app.listen(port, () => {
    console.log(`Backend listening on port ${ port }.`)
})