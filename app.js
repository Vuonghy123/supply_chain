'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/data', express.static(path.join(__dirname, 'data')));

const routesUser = require('./routes/userRoute');
routesUser(app);

const routesPost = require('./routes/postRoute');
routesPost(app);
const routesSearch = require('./routes/searchRoute');
routesSearch(app);
const routesFriend = require('./routes/friendRoute');
routesFriend(app);
const routesSetting = require('./routes/settingRoute');
routesSetting(app);

app.use((req, res) => {
    res.status(404).send({ url: req.originalUrl + ' not found' })
});

app.listen(port);
console.log('RESTful API server started on: ' + port);