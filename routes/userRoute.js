'use strict';

module.exports = (app) => {

    let authCtr = require('../controllers/authController');
    let userCtr = require('../controllers/userController');
    let authMid = require('../middleware/auth');
    
    app.route('/login').post(authCtr.login);
    app.route('/signup').post(authCtr.signup);

    app.use(authMid.isAuth);
    
    app.route('/refresh_token').post(authCtr.refreshToken);
    app.route('/logout').post(authCtr.logout);
    app.route('/change_password').post(userCtr.change_password);
    app.route('/set_user_profile').post(userCtr.set_user_profile);
    app.route('/info_userprofile').post(userCtr.info_userProfile);
}
