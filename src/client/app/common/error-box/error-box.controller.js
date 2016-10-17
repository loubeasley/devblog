function ErrorBoxController ($scope) {
    var ctrl = this;
    console.log(ctrl);
    console.log($scope);
}

ErrorBoxController.$inject = ['$scope'];

angular
    .module('common')
    .controller('ErrorBoxController', ErrorBoxController);