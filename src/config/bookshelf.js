import bookshelf from 'bookshelf';
import knex from 'knex';

const connections = {
    production: {
        client: 'mysql',
        connection: {
            host: 'nt71li6axbkq1q6a.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
            user: 'fi7jkxtj94gpzuow',
            password: 'v4xtcyrx27f4ho9k',
            database: 'uy5d6q1uth4xzbs8',
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