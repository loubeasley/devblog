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
            console.log(ctrl);
            $scope.$emit('postComment', {
                articleID: ctrl.article.articleID,
                body: ctrl.pendingComment,
                parentID: ctrl.comment ? ctrl.comment.commentID : null,
                reference: ctrl.comment,
                successCallback: function () {
                    ctrl.pendingComment = '';
                    ctrl.hideFn();
                }
            });
        }
    }
};

angular
    .module('components.blog')
    .component('replyBox', replyBox);