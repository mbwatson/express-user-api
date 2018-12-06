const mongoose = require('mongoose')
const path = require('path')
const fs = require('fs')
const photoDir = path.join(__dirname, '../public/photos')

const User = require('../models/User')

exports.list = (req, res) => {
    User.find()
    .select('username first_name last_name title aliases email phone _id')
    .exec()
    .then(users => {
        const response = {
            count: users.length,
            users: users.map(user => {
                return {
                    username: user.username,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    phone: user.phone,
                    title: user.title,
                    aliases: user.aliases,
                    _id: user._id,
                    request: {
                        type: 'GET',
                        url: `http://${req.headers.host}/${ user.username }`
                    },
                }
            })
        }
        res.status(200).json(response)
    })
    .catch(err => {
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
        aliases: req.body.title || [],
        title: req.body.title || '',
        phone: req.body.phone || '',
    })
    user.save()
        .then(result => {
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
                    aliases: result.aliases,
                    _id: result._id,
                    photo: `http://${req.headers.host}/${ user.username }/photo`,
                }
            })
        })
        .catch(err => {
            console.log(err)
            res.status(400).send('Unable to save to database')
        })
}

exports.get = (req, res) => {
    const username = req.params.username
    console.log(`Request for ${ username }`)
    User.findOne({ username: username })
        .select('username first_name last_name title email phone aliases _id')
        .exec()
        .then(user => {
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
        .catch(err => {
            res.status(500).json({ error: err })
        })
}

exports.put = (req, res) => {
    const username = req.params.username
    const updates = {}
    for (const incoming of req.body) {
        updates[incoming.property] = incoming.value
    }
    User.update({ username: username }, { $set: updates })
        .exec()
        .then(result => {
            console.log(result)
            res.status(200).json({
                message: 'User updated',
                request: {
                    type: 'GET',
                    url: `http://${req.headers.host}/${ username }`
                }
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err })
        })
}

// Add a user alias
exports.aliasAdd = (req, res) => {
    const username = req.params.username
    console.log(username, req.body.alias)
    User.update({ username: username }, { $push: { aliases: req.body.alias }})
        .exec()
        .then(result => {
            console.log(result)
            res.status(200).json({
                message: 'User aliases updated',
                request: {
                    type: 'GET',
                    url: `http://${req.headers.host}/${ username }`
                }
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err })
        })
}

// Remove a user alias
exports.aliasDelete = (req, res) => {
    const username = req.params.username
    const alias = req.body.alias
    User.findOne({ username: username })
        .exec()
        .then(user => {
            if (!user) {
                console.log(` > ${ username } not found`)
                return res.status(404).json({ message: `${ username } not found` })
            } else {
                console.log(` > ${ username } found`)
                aliases = user.aliases
                var index = aliases.indexOf(alias)
                if (index > -1) {
                    aliases.splice(index, 1)
                }
                User.update({ username: username }, { $set: { aliases: aliases } })
                    .exec()
                    .then(result => {
                        console.log(result)
                        res.status(200).json({
                            message: 'User aliases updated',
                            request: {
                                type: 'GET',
                                url: `http://${req.headers.host}/${ username }`
                            }
                        })
                    })
                    .catch(err => {
                        console.log(err)
                        res.status(500).json({ error: err })
                    })
            }
        })
        .catch(err => {
            return res.status(500).json({ error: err })
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
        .then(user => {
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
        .catch(err => {
            return res.status(500).json({ error: err })
        })
}

exports.delete_all = (req, res) => {
    User.deleteMany()
        .exec()
        .then(users => {
            res.status(200).json({ message: 'Deleted' })
        })
        .catch(err => {
            res.status(500).json({ error: err })
        })
}

