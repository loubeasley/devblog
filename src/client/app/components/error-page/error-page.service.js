function ErrorPageService () {
    return {
        afterLoginRedirect: null
    }
}

ErrorPageService.$inject = [];

angular
    .module('components.error-page')
    .factory('ErrorPageService', ErrorPageService);