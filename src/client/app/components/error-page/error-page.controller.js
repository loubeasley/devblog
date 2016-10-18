function ErrorPageController ($state, $stateParams, ErrorPageService) {
    var ctrl = this;
    console.log('ERROR PAGE@!');
    console.log(ctrl);
    console.log($stateParams);
    var errors = {
        404: 'Not Found',
        403: 'Access Denied'
    };
    ctrl.errorCode = $stateParams.error || 404;
    ctrl.errorDesc = errors[$stateParams.error || 404];
    ctrl.errorMsg = $stateParams.message;
    ctrl.back = function () {
        $state.go(ctrl.previousState.name || 'app.blog', ctrl.previousState.params || {});
    };
    ctrl.$onInit = function () {
        if($stateParams.error == 403)
            ErrorPageService.afterLoginRedirect = ctrl.previousState;
    }
}

ErrorPageController.$inject = ['$state', '$stateParams', 'ErrorPageService'];

angular.module('components.error-page')
    .controller('ErrorPageController', ErrorPageController);