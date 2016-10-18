var errorPage = {
    templateUrl: './error-page.html',
    controller: 'ErrorPageController',
    bindings: {
        previousState: '<'
    }
};

angular
    .module('components.error-page')
    .component('errorPage', errorPage)
    .config(function ($stateProvider) {
        $stateProvider
            .state('app.error-page', {
                url: '/error-page?error',
                component: 'errorPage',
                views: {
                    '': {
                        component: 'errorPage'
                    }
                },
                params: {
                    error: '404',
                    message: 'You took a wrong turn!',
                    previousState: null
                },
                resolve: {
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
                data: {
                    displayName: 'errorPage'
                }
            });
    });