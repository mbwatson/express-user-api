const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        validate: {
            validator: (addr) => {
                const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                return emailRegex.test(addr);
            },
        },
        required: true
    },
    phone: {
        type: String,
        trim: true,
        validate: {
            validator: (p) => {
                const phoneRegex = /^$|\d{3}-\d{3}-\d{4}$/
                return phoneRegex.test(p);
            },
        },
        required: false
    },
    first_name: {
        type: String,
        required: false,
        trim: true,
    },
    last_name: {
        type: String,
        required: false,
        trim: true,
    },
    title: {
        type: String,
        required: false,
        trim: true,
    },
    aliases: {
        type: Array,
        required: false,
        trim: true,
    },
},{
    collection: 'Staff'
})

module.exports = mongoose.model('User', User)
