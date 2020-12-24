"use strict";
let User = require("../models/user/userModel");

let multer = require('multer');
let path = require('path');
let bcrypt = require('bcrypt');
const { ok } = require("assert");
const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;

let storageAvatar = multer.diskStorage({
    destination: (req, file, callback) => { callback(null, './data'); },
    filename: (req, file, callback) => {
        callback(null, path.parse(file.originalname).name + '-' + Date.now() + path.extname(file.originalname));
    }
});
let uploadAvatar = multer({ storage: storageAvatar }).single('avatar');

exports.change_info_after_signup = async (req, res) => {
    try {
        let user = await User.findOne({
            id: req.jwtDecoded.data.id,
        }).exec();

        await uploadAvatar(req, res, async (err) => {
            if (err) {
                return res.json({
                    code: 9999,
                    message: err
                });
            } else {
                console.log(req.body.name, user)
                let link = '/data/' + req.file.filename;
                user.name = req.body.name;
                user.avatar = link;
                await user.save();
                res.json({
                    code: 1000,
                    message: "OK",
                    data: user
                })
            }
        });
    } catch (err) {
        res.json({
            code: 9999,
            message: err
        });
    }
};

exports.change_password = async (req, res) => {
    let user = await User.findOne({ id: req.jwtDecoded.data.id }).exec();
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
        return res.json({
            code: 2000,
            message: "Old password is wrong"
        });
    }
    else {
        let newpassword = await bcrypt.hash(req.body.new_password, saltRounds);
        user.password = newpassword;
        await user.save();
        res.json({
            code: 1000,
            message: "OK",
        });
    }
};


exports.set_user_info = async (req, res) => {
    User.findOne({
        id: req.jwtDecoded.data.id
    }).exec(async (err, data) => {
        if (err)
            res.json({
                code: 9999,
                message: err
            });
        else {
            if (data) {
                let user = new User(data);
                user.name = req.data.name;
                user.address = req.data.address;
                user.country = req.data.country;
                user.birthday = req.data.birthday;
                await user.save(async (err, data) => {
                    if (err)
                        res.json({
                            code: 9999,
                            message: err
                        });
                    else {
                        res.json({
                            code: 1000,
                            message: "OK",
                            data: data
                        });
                    }
                })
            }
        }
    })
}

exports.set_avatar = async (req, res) => {
    let user = await User.findOne({ id: req.jwtDecoded.data.id }).exec();

    await uploadAvatar(req, res, async (err) => {
        if (err) {
            return res.json({
                code: 9999,
                message: err
            });
        } else {
            let link = '/data/' + req.file.filename;
            user.avatar = link;
            await user.save((err, data) => {
                if (err) {
                    return res.json({
                        code: 9999,
                        message: err
                    });
                } else {
                    res.json({
                        code: 1000,
                        message: "OK",
                        data: data
                    })
                }
            });
        }
    });
}

let storageCover = multer.diskStorage({
    destination: (req, file, callback) => { callback(null, './data'); },
    filename: (req, file, callback) => {
        callback(null, path.parse(file.originalname).name + '-' + Date.now() + path.extname(file.originalname));
    }
});
let uploadCover = multer({ storage: storageCover }).single('cover');
exports.set_cover = async (req, res) => {
    let user = await User.findOne({
        id: req.jwtDecoded.data.id,
    }).exec();

    await uploadCover(req, res, async (err) => {
        if (err) {
            return res.json({
                code: 9999,
                message: err
            });
        } else {
            let link = '/data/' + req.file.filename;
            user.cover_photo = link;
            await user.save((err, data) => {
                res.json({
                    code: 1000,
                    message: "OK",
                    data: user
                })
            });
        }
    });
}

exports.info_user = (req, res) => {
    let user_id = req.body.user_id;
    console.log('user_id', user_id)
    User.findById((user_id), (err, data) => {
        if (err)
            res.json({
                code: 9999,
                message: err.message
            });
        else {
            if (data) {
                let info_user = data;
                res.json({
                    code: 1,
                    message: 'OK',
                    data: {
                        name: info_user.name,
                        status: info_user.status,
                        cover_photo: info_user.cover_photo,
                        avatar: info_user.avatar,
                        birthday: info_user.birthday,
                        address: info_user.address,
                        city: info_user.city,
                        country: info_user.country,
                        phone: info_user.phone,
                        created_at: info_user.created_at,
                        id: info_user.id
                    }
                })
            }
            else {
                res.json({
                    code: 9999,
                    message: 'No data'
                });
            }
        }
    })
}
