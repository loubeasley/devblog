var app = {
    templateUrl: './app.html',
    controller: 'AppController',
    bindings: {
        session: '<'
    }
};

angular
    .module('common')
    .component('app', app)
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('app', {
                abstract: true,
                redirectTo: 'blog',
                data: {
                    requiredAuth: true
                },
                component: 'app',
                resolve: {
                    session: function(SessionService) {
                        return SessionService.getSession();
                    }
                }
            });

        $urlRouterProvider.otherwise('/');
    });