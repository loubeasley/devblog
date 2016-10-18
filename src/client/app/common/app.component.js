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
                        console.log("start session resolve");
                        return SessionService.getSession()
                            .catch(function(err) {
                                console.log(err);
                            });
                    }
                }
            })
            .state('app.logged-in', {
                url: '/logged-in',
                template: '<div class="col-md-12 text-center"><h2>You are logged in as: <strong>{{$root.session.username}}</strong></h2></div>'
            });

        $urlRouterProvider.otherwise(function($injector, $location){
            var state = $injector.get('$state');
            if($location.path() === ' ' || $location.path() === '') {
                state.go('app.blog');
            } else state.go('app.error-page', {error: 404});
            return $location.path();
        });

        //send error msg to error page
        $transitionsProvider.onError({},
            function ($transition$) {
                $transition$.promise
                    .catch(function(err) {
                        if(err.hasOwnProperty('status') && err.status == 404)
                            return $transition$.router.stateService.go('app.error-page', {
                                error: 404,
                                message: err.message
                            });

                        return null;
                    })
            });

        $transitionsProvider.onBefore({ to: function (state) { return state.requiresAdmin }},
            function ($transition$) {
                console.log(angular.copy($transition$.router.stateService));
                return $transition$.injector().get('SessionService').getAuthorize()
                    .catch(function (err) {
                        $transition$.router.stateService.go('app.error-page', {
                            error: 403,
                            message: 'You do not have the proper permissions to access this page.'
                        });
                    })
            });


        $transitionsProvider.onBefore({ to: function (state) { return state.redirectIfAuth }},
            function ($transition$) {
                return $transition$.injector().get('SessionService').getSession()
                    .then(function (res) {
                        console.log(res);
                        return $transition$.router.stateService.go('app.logged-in');
                    })
                    .catch(function (err) {
                        return null;
                    })
            });
    })
    .run(function ($state) {
        $state.defaultErrorHandler(function() {
            // Do not log transitionTo errors
        });
    });