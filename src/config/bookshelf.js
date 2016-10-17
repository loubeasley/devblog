import bookshelf from 'bookshelf';
import knex from 'knex';

const connections = {
    production: {
        client: 'mysql',
        connection: {
            host: 'd5x4ae6ze2og6sjo.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
            user: 'mxpzuc8vc2j244zm',
            password: 'mrfdv4oie28nniis',
            database: 'nbr16jqlmdzdgt6l',
            charset: 'utf8'
        }
    },
    development: {
        client: 'mysql',
        connection: {
            host: 'localhost',
            user: 'root',
            password: 'Sinus1234',
            database: 'devblog',
            charset: 'utf8'
        }
    }
};

let _knex = knex(connections[process.env.NODE_ENV || 'development']);

let _bookshelf = bookshelf(_knex)
    .plugin('registry')
    .plugin('pagination');

export default _bookshelf;