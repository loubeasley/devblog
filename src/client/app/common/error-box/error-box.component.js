var errorBox = {
    templateUrl: './error-box.html',
    controller: 'ErrorBoxController',
    bindings: {
        errors: '<'
    }
};

angular
    .module('common')
    .component('errorBox', errorBox);