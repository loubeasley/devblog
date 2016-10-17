import bookshelf from '../config/bookshelf';

let Session = bookshelf.model('Session', {
    tableName: 'sessions'
});

export default Session;
export {Session as model};