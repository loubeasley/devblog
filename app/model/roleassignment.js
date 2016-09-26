var RoleAssignment = bookshelf.model('RoleAssignment', {
    tableName: 'roleassignments',
    idAttribute: 'roleassignmentID',
    user: function() {
        return this.belongsTo(bookshelf.model('User'), 'userID');
    }

});

module.exports = {
    model: RoleAssignment
};