var bcrypt = require('bcrypt-nodejs');

var User = bookshelf.model('User', {
    tableName: 'users',
    idAttribute: 'userID',
    roleassignment: function(){
        return this.hasOne(bookshelf.model('RoleAssignment'), 'userID')
    }
},
    {
        create: function(data) {
            var password = bcrypt.hashSync(data.password, null, null);

            return this.forge({
                otherID: data.otherID || null,
                username: data.username,
                password: password,
                access_token: data.access_token || null
            }).save();
        }
    });

User.prototype.toJSON = function () {
    return _.omit(this.serialize(), 'password');
};

var UserCollection = bookshelf.collection('User', {
        model: User
    },
    {
        findByID: function(id) {
            return this.forge().query({where:{ userID: id }}).fetch();
        }
    });

module.exports = {
    model: User,
    collection: UserCollection
};