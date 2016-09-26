var appNav = {
    templateUrl: './app-nav.html',
    controller: 'AppNavController',
    bindings: {
        session: '='
    }
};

angular
    .module('common')
    .component('appNav', appNav);