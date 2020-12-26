'use strict';
let mongoose = require('../../db');
let autoIncrement = require('mongoose-auto-increment');
let Schema = mongoose.Schema;

let UserSchema = new Schema({
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
    created_at: {
        type: Date,
        default: Date.now
    },
    role_name:{
        type: String,
        default: null,
    },
    role_id:{
        type: Number,
        default: null,
    }
});


module.exports = mongoose.model('Users', UserSchema);