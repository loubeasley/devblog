function blogController() {
    var ctrl = this;

    ctrl.$onInit = function() {
        ctrl.articles = ctrl.articles.reverse();
    }
}

angular
    .module('components.blog')
    .controller('BlogController', blogController);