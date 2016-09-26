function replyButton() {
    return {
        restrict: 'E',
        template: '<a ng-click="$ctrl.addReplyBox()">reply</a>',
        controllerAs: '$ctrl',
        scope: {
            comment: '<',
            article: '<'
        },
        bindToController: true,
        controller: function($scope, $element, $compile) {
            var ctrl = this;
            var selector = '#commentid-' + ctrl.comment.commentID + '-reply-box';
            var replyBox = null;
            var replyBoxScope = null;

            ctrl.isActive = false;
            ctrl.addReplyBox = function addReplyBox() {
                if(ctrl.isActive) {
                    ctrl.hideReplyBox();
                    return;
                }

                ctrl.isActive = true;
                replyBoxScope = $scope.$new();
                replyBox = $compile('<reply-box comment="$ctrl.comment" article="$ctrl.article" hide-fn="$ctrl.hideReplyBox()"></reply-box>')(replyBoxScope);
                $(selector).append(replyBox);
            };

            ctrl.hideReplyBox = function() {
                $(replyBox).remove();
                replyBoxScope.$destroy();
                replyBoxScope = null;
                replyBox = null;
                ctrl.isActive = false;
            }


        }
    }
}

angular
    .module('components.blog')
    .directive('replyButton', replyButton);