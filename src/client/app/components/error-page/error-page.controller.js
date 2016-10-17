function ErrorPageController ($state, $stateParams) {
    var ctrl = this;
    console.log($stateParams);
    var errors = {
        404: 'Not Found',
        403: 'Access Denied'
    };
    ctrl.errorCode = $stateParams.error || 404;
    ctrl.errorDesc = errors[$stateParams.error || 404];
    ctrl.back = function () {
        $state.go(ctrl.previousState.name || 'app.blog', ctrl.previousState.params || {});
    }
}

ErrorPageController.$inject = ['$state', '$stateParams'];

angular.module('components.error-page')
    .controller('ErrorPageController', ErrorPageController);