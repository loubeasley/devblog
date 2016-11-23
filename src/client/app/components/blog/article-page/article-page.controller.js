function ArticlePageController(BlogService, SessionService, $location, $scope, $anchorScroll, $document, $timeout) {
    var ctrl = this;
    ctrl.pendingComment = '';

    ctrl.$onInit = function() {
        ctrl.sortComments();

        $scope.$on('postComment', function ($event, comment) {
            ctrl.postComment(comment);
        })
    };

    ctrl.postComment = function (comment) {
        console.log(comment.reference);


        if(!comment.articleID) return toastr.error('Missing an article!');
        if(!comment.body) return toastr.error('The body is empty!');

        var isRootComment = !comment.parentID;

        SessionService.getSession()
            .then(function (session) {
                return BlogService.postCommentForArticle({
                    articleID: comment.articleID,
                    body: comment.body,
                    userID: session.userID,
                    parentID: isRootComment ? null : comment.parentID
                })
                    .then(function (results) {


                        if(isRootComment) ctrl.comments.unshift(results);
                        else {
                            if (!comment.reference.replies) comment.reference.replies = [];
                            comment.reference.replies.push(results);
                            comment.reference.hidden = false;
                        }

                        $scope.$emit('updateComments', {
                            article: ctrl.article,
                            parent: ctrl.comment,
                            comment: results
                        });



                        //$location.hash('article-' + results.articleID + '-comment-' + results.commentID);
                        //$anchorScroll();

                        if(comment.successCallback) comment.successCallback();

                        $timeout(function () {
                            var element = angular.element(document.getElementById('article-' + results.articleID + '-comment-' + results.commentID));
                            console.log(element);
                            $document.duScrollTo(element, 150, 1000);
                        }, 0);
                    });
            })
            .catch(function(err){
                toastr.error(err.message);
            });
    };

    //TODO
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

ArticlePageController.$inject = ['BlogService', 'SessionService', '$location', '$scope', '$anchorScroll', '$document', '$timeout'];

angular
    .module('components.blog')
    .controller('ArticlePageController', ArticlePageController);