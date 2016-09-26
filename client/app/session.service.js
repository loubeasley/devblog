function SessionService($http, $rootScope) {
    var session = null;
    function updateSession(newSession) {
        session = newSession;
        $rootScope.session = session;
        return session;
    }

    return {
        getSession: function() {
            return $http.get('/api/session')
                .then(function(response) {
                    return updateSession(response.data.session);
                });
        },
        login: function(loginObj) {
            return $http.post('/api/session/login', loginObj)
                .then(function(response) {
                    return updateSession(response.data.user);
                });
        },
        logout: function() {
            return $http.get('/api/session/logout')
                .then(function() {
                    return updateSession(null);
                });
        },
        currentSession: function () {
            return session;
        }
    }
}

SessionService.$inject = ['$http', '$rootScope'];

angular
    .module('common')
    .factory('SessionService', SessionService);