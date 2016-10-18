var register = {
    templateUrl: './register.html',
    controller: 'RegisterController'
};

angular
    .module('components.register')
    .component('register', register)
    .config(function ($stateProvider) {
        $stateProvider
            .state('app.register', {
                url: '/register',
                component: 'register',
                redirectIfAuth: true,
                views: {
                    '': {
                        component: 'register'
                    }
                },
                data: {
                    displayName: 'register'
                }
            });
    });