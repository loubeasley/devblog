import bookshelf from '../config/bookshelf';

let Session = bookshelf.model('Session', {
    tableName: 'sessions',
    hasTimestamps: false
});

export default Session;
export {Session as model};