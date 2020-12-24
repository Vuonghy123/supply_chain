'use strict';
let jwt = require('jsonwebtoken');

exports.generateToken = (user, secretSignature, tokenLife) => {
    return new Promise((resolve, reject) => {
        jwt.sign({
            data: user
        },
            secretSignature, {
            algorithm: "HS256",
            expiresIn: tokenLife,
        },
            (error, token) => {
                if (error) {
                    return reject(error);
                }
                resolve(token);
            });
    });
}

exports.verifyToken = (token, secretKey) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secretKey, (error, decoded) => {
            if (error) {
                return reject(error);
            }
            resolve(decoded);
        });
    });
}