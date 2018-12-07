const mongoose = require('mongoose')
const path = require('path')
const fs = require('fs')
const photoDir = path.join(__dirname, '../public/photos')

const User = require('../models/User')

exports.list = (req, res) => {
    User.find()
    .select('username first_name last_name title email phone _id')
    .exec()
    .then( users => {
        const response = {
            users: users.map( emp => {
                return {
                    username: emp.username,
                    first_name: emp.first_name,
                    last_name: emp.last_name,
                    email: emp.email,
                    phone: emp.phone,
                    title: emp.title,
                    _id: emp._id,
                    request: {
                        type: 'GET',
                        url: `http://${req.headers.host}/${ emp.username }`
                    },
                }
            })
        }
        res.status(200).json(response)
    })
    .catch( err => {
        console.log(err)
        res.status(500).json({ error: err })
    })
}

exports.post = (req, res) => {
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        username: req.body.username,
        email: `${ req.body.username }@${ process.env.DOMAIN_NAME }`,
        first_name: req.body.first_name || '',
        last_name: req.body.last_name || '',
        title: req.body.title || '',
        phone: req.body.phone || '',
    })
    user.save()
        .then( result => {
            console.log(result)
            res.status(201).json({
                message: 'Created user successfully',
                createdUser: {
                    username: result.username,
                    first_name: result.first_name,
                    last_name: result.last_name,
                    email: result.email,
                    phone: result.phone,
                    title: result.title,
                    _id: result._id,
                    photo: `http://${req.headers.host}/${ user.username }/photo`,
                }
            })
        })
        .catch( err => {
            console.log(err)
            res.status(400).send('Unable to save to database')
        })
}

exports.get = (req, res) => {
    const username = req.params.username
    console.log(`Request for ${ username }`)
    User.findOne({ username: username })
        .select('username first_name last_name title email phone _id')
        .exec()
        .then( user => {
            if (!user) {
                console.log(` > ${ username } not found`)
                return res.status(404).json({ message: `${ username } not found` })
            }
            console.log(` > ${ username } found`)
            return res.status(200).json({
                user: {
                    ...user._doc,
                    photo: `http://${req.headers.host}/${ user.username }/photo`,
                },
            })
        })
        .catch( err => {
            res.status(500).json({ error: err })
        })
}

exports.put = (req, res) => {
    const username = req.params.username
    const updates = {}
    for (const ops of req.body) {
        updates[ops.property] = ops.value
    }
    User.update({ username: username }, { $set: updates })
        .exec()
        .then( result => {
            console.log(result)
            res.status(200).json({
                message: 'User updated',
                request: {
                    type: 'GET',
                    url: `http://${req.headers.host}/${  username }`
                }
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err })
        })
}

exports.delete = (req, res) => {
    const username = req.params.username
    User.remove({ username: username })
        .exec()
        .then(user => {
            console.log(user)
            res.status(200).json({ message: 'User deleted'})
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err })
        })
}

exports.photo = (req, res) => {
    const username = req.params.username
    console.log(`Request for photo (${ username })`)
    const photoFilePath = path.resolve(photoDir, `${ username }.jpg`)
    User.findOne({ username: username })
        .exec()
        .then( user => {
            if (!user) {
                console.log(` > ${ username } not found`)
                return res.status(404).json({ message: `${ username } not found` })
            } else {
                console.log(` > ${ username } found`)
                if (fs.existsSync(photoFilePath)) {
                    console.log(` > return ${ username }.jpg`)
                    res.status(200).sendFile(photoFilePath)
                } else {
                    console.log(' > return default.jpg')
                    res.sendFile(path.resolve(photoDir, `default.jpg`))
                }            
            }
        })
        .catch( err => {
            return res.status(500).json({ error: err })
        })
}

exports.delete_all = (req, res) => {
    User.deleteMany()
        .exec()
        .then( users => {
            res.status(200).json({ message: 'Deleted' })
        })
        .catch(err => {
            res.status(500).json({ error: err })
        })
}

