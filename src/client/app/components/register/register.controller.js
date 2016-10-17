function RegisterController (SessionService, $state, $scope) {
    var ctrl = this;
    ctrl.fields = ['username', 'password', 'confirmPassword'];
    ctrl.registerData = {};
    ctrl.register = function () {
        if(!ctrl.registerData.username) return toastr.error('missing username');
        if(!ctrl.registerData.password) return toastr.error('missing password');
        if(!ctrl.registerData.confirmPassword) return toastr.error('missing confirmPassword');

        SessionService.signup(ctrl.registerData)
            .then(function (res) {
                if(res.data.success) {
                    toastr.success('Registration was successful!');
                    $state.go('app.blog');
                }

                if(res.data.errors) {
                    $scope.serverErrors = ctrl.errors = res.data.errors;
                }
            });


    };
}

RegisterController.$inject = ['SessionService', '$state', '$scope'];

angular.module('components.register')
    .controller('RegisterController', RegisterController);