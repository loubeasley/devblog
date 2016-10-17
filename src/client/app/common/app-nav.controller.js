var AppNavController = function($http, sessionService, $state) {
    var ctrl = this;
    ctrl.login = {
        username: null,
        password: null,
        remember: false
    };
    ctrl.submit = function() {
        sessionService.login(ctrl.login)
            .then(function(res) {
                if(res.data.success) ctrl.session = res;
                else if (!res.data.success) {
                    console.log('blarg');
                    $state.go('app.login', {
                        password: ctrl.login.password,
                        username: ctrl.login.username,
                        errors: res.data.errors
                    });
                }
            });
    };
    ctrl.logout = function() {
        sessionService.logout()
            .then(function() {
                ctrl.session = null;
                $state.go('app.blog');
            });
    };
};

AppNavController.$inject = ['$http', 'SessionService', '$state'];

angular
    .module('common')
    .controller('AppNavController', AppNavController);