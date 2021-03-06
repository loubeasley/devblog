function LoginController (SessionService, $state, $stateParams, $scope, ErrorPageService) {
    var ctrl = this;
    ctrl.fields = ['username', 'password'];
    ctrl.loginData = {
        username: $stateParams.username || '',
        password: $stateParams.password || '',
    };
    ctrl.login = function () {
        if(!ctrl.loginData.username) return toastr.error('missing username');
        if(!ctrl.loginData.password) return toastr.error('missing password');

        SessionService.login(ctrl.loginData)
            .then(function(res) {
                if(res.data.success) {
                    toastr.success('Login was successful!');
                    if(ErrorPageService.afterLoginRedirect) {
                        ctrl.previousState = ErrorPageService.afterLoginRedirect;
                        console.log(ctrl.previousState);
                    }
                    $state.go(ctrl.previousState.name, ctrl.previousState.params, {reload: true});
                }

                if(res.data.errors) {
                    $scope.serverErrors = ctrl.errors = res.data.errors;
                }

            });
    };

    ctrl.reload = function (){
        $state.go('.', {errors: ['you done fucked up']})
    };

    ctrl.$onInit = function () {
        if(ctrl.errors) $scope.serverErrors = ctrl.errors;

    };



}

LoginController.$inject = ['SessionService', '$state', '$stateParams', '$scope', 'ErrorPageService'];

angular.module('components.login')
    .controller('LoginController', LoginController);