function ArticlePageController(BlogService, SessionService, $http) {
    var ctrl = this;
    console.log(ctrl);
    ctrl.pendingComment = '';


}

ArticlePageController.$inject = ['BlogService', 'SessionService', '$http'];

angular
    .module('components.blog')
    .controller('ArticlePageController', ArticlePageController);