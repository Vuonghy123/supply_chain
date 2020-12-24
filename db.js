'use strict';
let mongoose = require('mongoose');
let autoIncrement = require('mongoose-auto-increment');
let DB = process.env.DATBASE_NAME || "facebookapp";
// let mongoDB = "mongodb://127.0.0.1:27017/" + DB;
let mongoDB = "mongodb+srv://ducpb:ducpb@cluster0.wpscg.mongodb.net/facebookapp?retryWrites=true&w=majority";
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);

mongoose.connect(mongoDB);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

autoIncrement.initialize(db);

module.exports = mongoose;

