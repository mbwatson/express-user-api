const express = require('express')
const app = express()
const api = express.Router()

const User = require('../controllers/User')

// Return array of all users
api.route('/').get(User.list)
// Delete all users
api.route('/delete/all').delete(User.delete_all)
// Add new user
api.route('/').post(User.post)
// Return user
api.route('/:username').get(User.get)
// Update user
api.route('/:username').put(User.put)
// Delete user
api.route('/:username').delete(User.delete)
// Return user photo
api.route('/:username/photo').get(User.photo)

module.exports = api