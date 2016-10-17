import bcrypt from 'bcrypt-nodejs';
import bookshelf from '../config/bookshelf';

var User = bookshelf.model('User', {
        tableName: 'users',
        idAttribute: 'userID',
        role: function () {
            return this.hasOne(bookshelf.model('RoleAssignment'), 'userID')
        }
    },
    {
        create: function (data) {
            var password = bcrypt.hashSync(data.password, null, null);

            return this.forge({
                otherID: data.otherID || null,
                username: data.username,
                password: password,
                access_token: data.access_token || null
            }).save()
                .then(function(user) {
                    return user.fetch({withRelated: ['role']}); //TODO JANK
                })
        },
        withRole: function (data) {
            return this.query(qb => {
                qb.select(['users.username', 'users.userID', 'roleassignments.roleID', 'roleassignments.userID'])
                    .leftJoin('roleassignments', 'users.userID', 'roleassignments.userID')
                    .where('users.userID', data.userID);
            })
        }
    });

User.prototype.toJSON = function () {
    return _.omit(this.serialize(), 'password');
};

var UserCollection = bookshelf.collection('User', {
        model: User
    },
    {
        findByID: function (id) {
            return this.forge().query({where: {userID: id}}).fetch();
        }
    });

export default User;
export {User as model, UserCollection as collection};
