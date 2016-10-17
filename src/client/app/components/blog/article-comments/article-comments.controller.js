function ArticleCommentsController (BlogService, SessionService, marked, $scope) {
    var ctrl = this;

    ctrl.$onInit = function() {
        $scope.$on('updateComments', function(event, data) {
            event.stopPropagation();
            /*ctrl.comments.unshift(data.comment);*/
        });

        ctrl.sortComments();
    };

    ctrl.postComment = function() {
        BlogService.postCommentForArticle({
            articleID: ctrl.article.articleID,
            body: ctrl.pendingComment,
            userID: SessionService.currentSession().userID
        })
            .then(function (results) {
                //console.log(results);
                ctrl.comments.unshift(results);
            });
    };

    ctrl.sortComments = function() {
        function getChildComments(parentComment, callback) {
            // Mock asynchronous implementation, for testing the rest of the code
            var children = ctrl.comments.filter(function (comment) {

                return comment.parentID == parentComment.commentID;
            });

            callback(null, children);
        }

        var container = {}; // dummy node to collect complete hierarchy into
        getBlock([container], function rootCallback(){
            ctrl.comments = container.replies;
        });

        function getBlock(comments, callback) {
            if (!comments || !comments.length) {
                // Nothing to do, call back synchronously
                callback(comments);
                return;
            }
            var leftOver = comments.length;
            comments.forEach(function commentIter(comment) {
                getChildComments(comment, function getChildCommentCallback(err, children) {
                    comment.replies = children;
                    // provide custom callback:
                    getBlock(children, function getBlockCallback() {
                        // only call parent's callback when all is done here:
                        if (--leftOver === 0) callback(comments);
                    });
                });
            });
        }
    }

}

ArticleCommentsController.$inject = ['BlogService', 'SessionService', 'marked', '$scope'];

angular
    .module('components.blog')
    .controller('ArticleCommentsController', ArticleCommentsController);