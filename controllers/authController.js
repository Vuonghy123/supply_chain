'use strict';
let jwtHelper = require("../helper/jwtHelper");
let User = require("../models/user/userModel");
let UserProfile = require("../models/user/userProfileModel");
let bcrypt = require('bcrypt');

const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
let tokenList = {};
const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || "365d";
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "KEY";
const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE || "3650d";
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "KEY";

exports.signup = (req, res) => {
    let user = new User(req.body);
    User.find({
        phone: user.phone
    }, (err, data) => {
        if (err)
            res.send(err)
        if (data.length) {
            res.json({
                code: 9996,
                message: "User existed"
            })
        } else {
            bcrypt.hash(user.password, saltRounds, (err, hash) => {
                user.password = hash;
                user.save(async (err, data) => {
                    if (err)
                        res.send(err.message)
                    else {
                        user.password = undefined;
                        let userData = user;

                        const accessToken = await jwtHelper.generateToken(userData, accessTokenSecret, accessTokenLife);
                        const refreshToken = await jwtHelper.generateToken(userData, refreshTokenSecret, refreshTokenLife);

                        tokenList[refreshToken] = {
                            accessToken,
                            refreshToken
                        };

                        res.json({
                            code: 1,
                            message: "OK",
                            accessToken,
                            refreshToken,
                            data: data
                        });
                        let userProfile = new UserProfile({
                            user_id: data._id,
                            name: data.name,
                        })
                        userProfile.save();
                    }
                })

            })
        }
    })
}

exports.login = async (req, res) => {
    console.log("req", req.body)
    try {
        let user = await User.findOne({
            phone: req.body.phone
        }).exec();

        if (!user) {
            return res.json({
                message: 'Phone number no already exist',
                code: 999
            });
        }
        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) {
            return res.json({
                code: 1011,
                message: 'Password are incorrect'
            });
        }

        user.password = undefined;
        let userData = user;

        const accessToken = await jwtHelper.generateToken(userData, accessTokenSecret, accessTokenLife);
        const refreshToken = await jwtHelper.generateToken(userData, refreshTokenSecret, refreshTokenLife);

        tokenList[refreshToken] = {
            accessToken,
            refreshToken
        };

        return res.status(200).json({
            code: 1,
            message: "OK",
            accessToken,
            refreshToken,
            data: userData
        });
    } catch (error) {
        return res.status(500).json(error);
    }
}

exports.refreshToken = async (req, res) => {
    const refreshTokenFromClient = req.body.refreshToken;
    if (refreshTokenFromClient && (tokenList[refreshTokenFromClient])) {
        try {
            const decoded = await jwtHelper.verifyToken(refreshTokenFromClient, refreshTokenSecret);
            const userData = decoded.data;
            const accessToken = await jwtHelper.generateToken(userData, accessTokenSecret, accessTokenLife);
            return res.status(200).json({
                accessToken
            });
        } catch (error) {
            res.status(403).json({
                code: 9998,
                message: 'RefreshToken is invalid',
            });
        }
    } else {
        return res.status(403).send({
            code: 9999,
            message: 'Exception error',
        });
    }
};

exports.logout = async (req, res) => {
    const refreshTokenFromClient = req.body.refreshToken;
    if (refreshTokenFromClient && (tokenList[refreshTokenFromClient])) {
        try {
            delete tokenList[refreshTokenFromClient];
            return res.status(200).json({
                code: 1,
                message: "OK"
            });
        } catch (error) {
            res.status(403).json({
                code: 9998,
                message: 'RefreshToken is invalid',
            });
        }
    } else {
        return res.status(403).send({
            code: 9999,
            message: 'Exception error',
        });
    }
}