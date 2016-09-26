var replyBox = {
    bindings: {
        comment: '<',
        article: '<',
        hideFn: '&'
    },
    templateUrl: './reply-box.html',
    controller: function ($scope, BlogService, SessionService) {
        var ctrl = this;
        ctrl.pendingComment = '';

        ctrl.$onDestroy = function() {
            console.log("DESTROY");
        };

        ctrl.postComment = function() {
            BlogService.postCommentForArticle({
                articleID: ctrl.article.articleID,
                body: ctrl.pendingComment,
                userID: SessionService.currentSession().userID,
                parentID: ctrl.comment.commentID
            })
                .then(function (results) {
                    if(!ctrl.comment.replies) ctrl.comment.replies = [];
                    ctrl.comment.replies.push(results);
                    ctrl.hideFn();
                    $scope.$emit('updateComments', {
                        article: ctrl.article,
                        parent: ctrl.comment,
                        comment: results
                    })
                });
        }
    }
};

angular
    .module('components.blog')
    .component('replyBox', replyBox);