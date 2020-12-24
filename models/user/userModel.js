'use strict';
let mongoose = require('../../db');
let autoIncrement = require('mongoose-auto-increment');
let Schema = mongoose.Schema;

let UserSchema = new Schema({
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        default: null
    },
    phone: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    password: {
        type: String,
        required: true,
        default: null
    },
    status: {
        type: String,
        required: true,
        default: "active"
    },
    cover_photo: {
        type: String,
        default: null
    },
    avatar: {
        type: String,
        default: null
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    birthday: {
        type: Date,
        default: null
    },
    address: {
        type: String,
        default: null
    },
    city: {
        type: String,
        default: null
    },
    country: {
        type: String,
        default: null
    }
});

UserSchema.plugin(autoIncrement.plugin, {
    model: 'User',
    field: 'id'
});

module.exports = mongoose.model('User', UserSchema);