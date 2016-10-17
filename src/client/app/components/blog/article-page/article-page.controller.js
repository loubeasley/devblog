function ArticlePageController(BlogService, SessionService, $state) {
    var ctrl = this;
    ctrl.pendingComment = '';

}

ArticlePageController.$inject = ['BlogService', 'SessionService', '$state'];

angular
    .module('components.blog')
    .controller('ArticlePageController', ArticlePageController);