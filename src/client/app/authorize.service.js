function AuthorizeService ($rootScope, SessionService, $state, $timeout, $q) {
    return {
        authorize: function () {
            return SessionService.getSession(true)
                .then(function() {
                    if(SessionService.isAuthenticated() && SessionService.isAdmin())
                        return $q.when();
                    return $q.reject('403 Access Denied');
                })
        },
        authenticate: function () {
            return SessionService.getSession()
        }
    }
}

AuthorizeService.$inject = ['$rootScope', 'SessionService', '$state', '$timeout', '$q'];

angular
    .module('common')
    .factory('AuthorizeService', AuthorizeService);