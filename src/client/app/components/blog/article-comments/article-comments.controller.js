function ArticleCommentsController (BlogService, SessionService, marked, $scope, $location, $anchorScroll) {
    var ctrl = this;

    ctrl.$onInit = function() {
        $scope.$on('updateComments', function(event, data) {
            event.stopPropagation();
            /*ctrl.comments.unshift(data.comment);*/
        });

        ctrl.sortComments();
    };

    ctrl.postComment = function() {
        SessionService.getSession()
            .then(function (session) {
                return BlogService.postCommentForArticle({
                    articleID: ctrl.article.articleID,
                    body: ctrl.pendingComment,
                    userID: session.userID
                })
                    .then(function (results) {
                        ctrl.pendingComment = '';
                        ctrl.comments.unshift(results);

                        $location.hash('article-' + results.articleID + '-comment-' + results.commentID);
                        $anchorScroll();
                    });
            })
            .catch(function(err){
                toastr.error(err.message);
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

ArticleCommentsController.$inject = ['BlogService', 'SessionService', 'marked', '$scope', '$location', '$anchorScroll'];

angular
    .module('components.blog')
    .run(['$anchorScroll', function($anchorScroll) {
        $anchorScroll.yOffset = 150;   // always scroll by 50 extra pixels
    }])
    .controller('ArticleCommentsController', ArticleCommentsController);