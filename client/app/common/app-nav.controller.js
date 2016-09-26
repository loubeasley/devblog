var AppNavController = function($http, sessionService) {
    var ctrl = this;
    ctrl.login = {
        username: null,
        password: null,
        remember: false
    };
    ctrl.submit = function() {
        sessionService.login(ctrl.login)
            .then(function(result) {
                ctrl.session = result;
            });
    };
    ctrl.logout = function() {
        sessionService.logout()
            .then(function() {
                ctrl.session = null;
            });
    };
};

AppNavController.$inject = ['$http', 'SessionService'];

angular
    .module('common')
    .controller('AppNavController', AppNavController);