'use strict';

let jwtHelper = require("../helper/jwtHelper");

const accessTokenSecret = process.env.SECRETKEY || "KEY";

exports.isAuth = async (req, res, next) => {

    if (req.headers && req.headers.authorization && String(req.headers.authorization.split(' ')[0]).toLowerCase() == 'bearer') {
        var tokenFromClient = req.headers.authorization.split(' ')[1];
        try {
            const decoded = await jwtHelper.verifyToken(tokenFromClient, accessTokenSecret);
            req.jwtDecoded = decoded;
            next();
        } catch (error) {
            return res.status(401).json({
                code: 1009,
                message: 'Not access',
            });
        }
    }
    else {
        return res.status(403).send({
            code: 9998,
            message: 'Token is invalid',
        });
    }
}