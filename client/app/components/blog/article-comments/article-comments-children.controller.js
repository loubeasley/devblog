function ArticleCommentsChildrenController (BlogService, SessionService) {
    var ctrl = this;



    ctrl.$onInit = function() {
        console.log(ctrl);
        /*BlogService.getCommentsByArticle({
            articleID: ctrl.article.articleID,
            parentID: ctrl.parentId
        })
            .then(function(response) {
                console.log(response);
                ctrl.comments = response.results || [];
            });*/
    };

    ctrl.postComment = function() {
        if(ctrl.pendingComment.length == 0 || ctrl.pendingComment.length > 255) return;

        BlogService.postCommentForArticle({
            articleID: ctrl.article.articleID,
            body: ctrl.pendingComment,
            userID: SessionService.currentSession().userID
        })
            .then(function (results) {
                console.log(results);
                ctrl.comments.unshift(results);
            });
    }

}

ArticleCommentsChildrenController.$inject = ['BlogService', 'SessionService'];

angular
    .module('components.blog')
    .controller('ArticleCommentsChildrenController', ArticleCommentsChildrenController);