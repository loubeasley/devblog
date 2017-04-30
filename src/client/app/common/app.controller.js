function AppController($state, $rootScope, $stateParams) {
    var ctrl = this;

    console.log($stateParams);
}

angular
    .module('common')
    .controller('AppController', AppController);