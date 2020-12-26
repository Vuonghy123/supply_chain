'use strict';
let mongoose = require('../../db');
let Schema = mongoose.Schema;

let UserProfileSchema = new Schema({
    user_id: {
        type: String
    },
    address: {
        type: String,
        default: null
    },
    longtitude: {
        type: Number,
        default: null
    },
    latitude: {
        type: Number,
        default: null
    },
    description: {
        type: String,
    },
    payMethods: {
        type: String,
        default: null
    },
    created_at: {
        type: Date,
        default: Date.now
    },
});


module.exports = mongoose.model('userProfiles', UserProfileSchema);