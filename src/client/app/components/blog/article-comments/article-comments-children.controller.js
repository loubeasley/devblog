function ArticleCommentsChildrenController (BlogService, SessionService, $location, $anchorScroll, $scope) {
    var ctrl = this;
    ctrl.hidden = ctrl.parentId != 'root';
    ctrl.onPost = function () {
        $scope.$emit('postComment', 'asdf');
    }
}

ArticleCommentsChildrenController.$inject = ['BlogService', 'SessionService', '$location', '$anchorScroll', '$scope'];

angular
    .module('components.blog')
    .controller('ArticleCommentsChildrenController', ArticleCommentsChildrenController);