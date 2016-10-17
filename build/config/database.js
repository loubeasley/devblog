'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var production = {
    client: 'mysql',
    connection: {
        host: 'd5x4ae6ze2og6sjo.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        user: 'mxpzuc8vc2j244zm',
        password: 'mrfdv4oie28nniis',
        database: 'nbr16jqlmdzdgt6l',
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