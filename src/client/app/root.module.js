angular.module('root', [
    'common',
    'components',
    'templates'
])
    .run(function ($rootScope, $state, $stateParams, SessionService, AuthorizeService) {
        $rootScope.$on('$locationChangeSuccess',
            function (event, toState, toStateParams) {

                // track the state the user wants to go to;
                // authorization service needs this
                $rootScope.toState = toState;
                $rootScope.toStateParams = toStateParams;
                console.log('asdfasdfasdf');
                // if the principal is resolved, do an
                // authorization check immediately. otherwise,
                // it'll be done when the state it resolved.
                /*if (SessionService.isResolved())
                    AuthorizeService.authorize();*/
            });

    });
