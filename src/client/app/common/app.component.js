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
    .config(function ($stateProvider, $urlRouterProvider, $transitionsProvider) {
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
            })
            .state('app.logged-in', {
                template: '<div class="col-md-12 text-center"><h2>You are logged in as: <strong>{{$root.session.username}}</strong></h2></div>'
            });

        $urlRouterProvider.otherwise(function($injector, $location){
            var state = $injector.get('$state');
            if($location.path() === ' ' || $location.path() === '') {
                state.go('app.blog');
            } else state.go('app.error-page', {error: 404});
            return $location.path();
        });

        $transitionsProvider.onStart({ to: function (state) { return state.requiresAdmin }},
            function ($transition$) {

                return $transition$.injector().get('AuthorizeService').authorize()
                    .catch(function (err) {
                        $transition$.router.stateService.go('app.error-page', {error: 403});
                    })
            });

        $transitionsProvider.onStart({ to: function (state) { return state.redirectIfAuth }},
            function ($transition$) {
                var sessionService = $transition$.injector().get('SessionService');
                var deferred = $transition$.injector().get('$q').defer();

                if(sessionService.isAuthenticated()) deferred.reject();
                else deferred.resolve();

                return deferred.promise
                    .catch(function (err) {
                        $transition$.router.stateService.go('app.logged-in');
                    })
            });
    });