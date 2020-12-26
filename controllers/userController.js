"use strict";
let User = require("../models/user/userModel");
let UserProfile = require("../models/user/userProfileModel");
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


exports.set_user_profile = async (req, res) => {
    let user_id = req.body.user_id;
    console.log('user_id', user_id)
    UserProfile.findOneAndUpdate({ user_id: user_id }, req.body)
        .exec(async (err, data) => {
            if (err)
                res.json({
                    code: 9999,
                    message: err
                });
            else {
                res.json({
                    code: 1,
                    message: "OK",
                    data: data
                })
            }
        })
}
exports.info_userProfile = (req, res) => {
    let user_id = req.body.user_id;
    console.log('user_id', user_id)
    UserProfile.findOne({
        user_id: user_id
    }).exec(async (err, data) => {
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
                        user_id: info_user.user_id,
                        address: info_user.address,
                        longtitude: info_user.longtitude,
                        latitude: info_user.latitude,
                        description: info_user.description,
                        payMethods: info_user.payMethods,
                        created_at: info_user.created_at,
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

// exports.change_info_after_signup = async (req, res) => {
//     try {
//         let user = await User.findOne({
//             id: req.jwtDecoded.data.id,
//         }).exec();

//         await uploadAvatar(req, res, async (err) => {
//             if (err) {
//                 return res.json({
//                     code: 9999,
//                     message: err
//                 });
//             } else {
//                 console.log(req.body.name, user)
//                 let link = '/data/' + req.file.filename;
//                 user.name = req.body.name;
//                 user.avatar = link;
//                 await user.save();
//                 res.json({
//                     code: 1000,
//                     message: "OK",
//                     data: user
//                 })
//             }
//         });
//     } catch (err) {
//         res.json({
//             code: 9999,
//             message: err
//         });
//     }
// };

// exports.set_avatar = async (req, res) => {
//     let user = await User.findOne({ id: req.jwtDecoded.data.id }).exec();

//     await uploadAvatar(req, res, async (err) => {
//         if (err) {
//             return res.json({
//                 code: 9999,
//                 message: err
//             });
//         } else {
//             let link = '/data/' + req.file.filename;
//             user.avatar = link;
//             await user.save((err, data) => {
//                 if (err) {
//                     return res.json({
//                         code: 9999,
//                         message: err
//                     });
//                 } else {
//                     res.json({
//                         code: 1000,
//                         message: "OK",
//                         data: data
//                     })
//                 }
//             });
//         }
//     });
// }

// let storageCover = multer.diskStorage({
//     destination: (req, file, callback) => { callback(null, './data'); },
//     filename: (req, file, callback) => {
//         callback(null, path.parse(file.originalname).name + '-' + Date.now() + path.extname(file.originalname));
//     }
// });
// let uploadCover = multer({ storage: storageCover }).single('cover');
// exports.set_cover = async (req, res) => {
//     let user = await User.findOne({
//         id: req.jwtDecoded.data.id,
//     }).exec();

//     await uploadCover(req, res, async (err) => {
//         if (err) {
//             return res.json({
//                 code: 9999,
//                 message: err
//             });
//         } else {
//             let link = '/data/' + req.file.filename;
//             user.cover_photo = link;
//             await user.save((err, data) => {
//                 res.json({
//                     code: 1000,
//                     message: "OK",
//                     data: user
//                 })
//             });
//         }
//     });
// }
