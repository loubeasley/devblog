var Role = bookshelf.model('Role', {
    tableName: 'roles',
    idAttribute: 'roleID',
    roleassignment: function() {
        return this.belongsTo(bookshelf.model('RoleAssignment'), 'roleID');
    }
});

module.exports = {
    model: Role
};