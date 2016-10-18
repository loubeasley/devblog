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

    var _service = {
        getSession: function(force) {
            console.log('begin getting session');
            var deferredSession = $q.defer();

            if (force === true) updateSession(undefined);

            deferredSession.resolve(!angular.isDefined(_session) ? $http.get('/api/session') : {
                data: {
                    success: !!_session,
                    session: _session
                }
            });

            return deferredSession.promise
                .then(function (res) {
                    return $q(function(resolve, reject) {
                        updateSession(res.data.session || null);
                        if(res.data.success) {
                            resolve(_session);
                        } else reject({status: 204, message: 'User not authenticated'});
                    })
                });
        },
        getAuthorize: function() {
            return _service.getSession()
                .then(function() {
                    if(_service.isAuthenticated() && _service.isAdmin())
                        return $q.when({
                            success: true,
                            session: _session
                        });
                    else return $q.reject({
                        status: 403,
                        message: 'User not authorized'
                    })
                })
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
    };

    return _service;
}

SessionService.$inject = ['$http', '$rootScope', '$q'];

angular
    .module('common')
    .factory('SessionService', SessionService);