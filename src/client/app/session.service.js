function SessionService($http, $rootScope, $q) {
    var _session = undefined;
    var _authenticated = false;
    var ADMIN_ROLE = 2;
    var USER_ROLE = 1;

    function updateSession(newSession) {
        _session = newSession;
        _authenticated = !!newSession;
        $rootScope.session = _session;
        return _session;
    }

    return {
        getSession: function(force) {
            var deferred = $q.defer();

            if (force === true) updateSession(undefined);

            if (!angular.isDefined(_session))
                $http.get('/api/session')
                    .then(function(res) {
                        var tempSess = res.data.session || null;
                        console.log(tempSess);

                        /*if(res.data.success && tempSess) {
                            if(tempSess.role !== 1 || tempSess.role !== 2)
                                tempSess.role = USER_ROLE;
                        }*/

                        updateSession(tempSess);

                    });

            deferred.resolve(_session);

            return deferred.promise;
        },
        isResolved: function () {
            return angular.isDefined(_session);
        },
        isAuthenticated: function () {
            return _authenticated;
        },
        isAdmin: function () {
            console.log(_session);
            return _authenticated && _session.role.roleID === ADMIN_ROLE
        },
        login: function(loginObj) {
            return $http.post('/api/session/login', loginObj)
                .then(function(res) {
                    if(res.data.message && res.data.message.length > 0)
                        toastr[res.data.success ? 'success' : 'error'](res.data.message);

                    if(res.data.success) updateSession(res.data.user);

                    return res;
                });
        },
        logout: function() {
            return $http.get('/api/session/logout')
                .then(function(res) {
                    toastr.success('You are now logged out!');
                    updateSession(null);
                    return res;
                });
        },
        signup: function(registerObj) {
            return $http.post('/api/session/signup', registerObj)
                .then(function(res) {
                    if(res.data.message && res.data.message.length > 0)
                        toastr[res.data.success ? 'success' : 'error'](res.data.message);

                    if(res.data.success) updateSession(res.data.user);

                    return res;
                });
        },
        currentSession: function () {
            return _session;
        }
    }
}

SessionService.$inject = ['$http', '$rootScope', '$q'];

angular
    .module('common')
    .factory('SessionService', SessionService);