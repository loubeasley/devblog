var login = {
    templateUrl: './login.html',
    controller: 'LoginController',
    bindings: {
        errors: '<',
        previousState: '<'
    }
};

angular
    .module('components.login')
    .component('login', login)
    .config(function ($stateProvider) {
        $stateProvider
            .state('app.login', {
                url: '/login?username',
                component: 'login',
                params: {
                    errors: null,
                    password: null
                },
                redirectIfAuth: true,
                resolve: {
                    'errors': function($stateParams) {
                        console.log($stateParams);
                        return $stateParams.errors;
                    },
                    previousState: [
                        "$state",
                        function ($state) {
                            console.log($state.params);
                            return {
                                name: $state.current.name,
                                params: angular.copy($state.params),
                                URL: $state.href($state.current.name, $state.params)
                            };
                        }
                    ]
                },
                views: {
                    '': {
                        component: 'login'
                    },
                    widget: {
                        template: 'asdf'
                    }/*,
                    'errors@app.login': {
                        component: 'errorBox'
                    }*/
                },
                data: {
                    displayName: 'login'
                }
            });
    });