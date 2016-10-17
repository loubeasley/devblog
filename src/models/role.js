import bookshelf from '../config/bookshelf'

var Role = bookshelf.model('Role', {
    tableName: 'roles',
    idAttribute: 'roleID',
    roleassignment: function() {
        return this.belongsTo(bookshelf.model('RoleAssignment'), 'roleID');
    }
});

export default Role;
export {Role as model};