angular.module('root', [
    'common',
    'components',
    'templates'
])
    .run(function ($rootScope, $state, $stateParams, SessionService, AuthorizeService) {
        $rootScope.$on('$locationChangeSuccess',
            function (event, toState, toStateParams) {
                $rootScope.toState = toState;
                $rootScope.toStateParams = toStateParams;
            });

    });
