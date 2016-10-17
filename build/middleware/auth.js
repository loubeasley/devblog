'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
function adminAuth(req, res, next) {
    if (!req) return;

    if (req.session.user && req.session.user.role.roleID === 2) next();else res.json({
        success: false,
        message: 'You don\'t have permission to do that!'
    });
}

function userAuth(req, res, next) {
    if (!req) return;

    if (req.isAuthenticated() && req.session.user) next();else res.json({
        success: false,
        message: 'You need to be logged in to do that!'
    });
}

function isYou(req, res, next) {
    if (!req) return;

    if (req.isAuthenticated() && req.session.user.userID === req.param.userID) next();else res.json({
        success: false,
        message: 'You don\'t have permission to do that!'
    });
}

exports.default = adminAuth;
exports.admin = adminAuth;
exports.user = userAuth;
exports.isYou = isYou;