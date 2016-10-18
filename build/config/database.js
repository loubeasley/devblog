'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var production = {
    client: 'mysql',
    connection: {
        host: 'nt71li6axbkq1q6a.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        user: 'fi7jkxtj94gpzuow',
        password: 'mrfdv4oie28nniis',
        database: 'v4xtcyrx27f4ho9k',
        charset: 'utf8'
    }
};

var development = {
    client: 'mysql',
    connection: {
        host: 'localhost',
        user: 'root',
        password: 'Sinus1234',
        database: 'devblog',
        charset: 'utf8'
    }
};

exports.production = production;
exports.development = development;