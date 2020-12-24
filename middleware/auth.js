'use strict';

let jwtHelper = require("../helper/jwtHelper");

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "KEY";

exports.isAuth = async (req, res, next) => {
  console.log("zo day");
  const tokenFromClient = req.body.accessToken || req.headers["x-access-token"] || req.headers["accesstoken"];
  if (tokenFromClient) {
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
  } else {
    return res.status(403).send({
      code: 9998,
      message: 'Token is invalid',
    });
  }
}