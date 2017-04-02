function replyButton() {
    return {
        restrict: 'E',
        //template: '<a ng-click="$ctrl.addReplyBox()">reply</a>',
        templateUrl: './reply-button.html',
        controllerAs: '$ctrl',
        scope: {
            comment: '<',
            article: '<',
            onPost: '&'
        },

        controller: function($scope, $element, $compile) {

            var ctrl = this;
            console.log(ctrl);
            var selector = '#commentid-' + ctrl.comment.commentID + '-reply-box';
            var replyBox = null;
            var replyBoxScope = null;

            ctrl.isActive = false;
            ctrl.addReplyBox = function addReplyBox() {
                if(ctrl.isActive || !$scope.$root.session) {
                    if(!$scope.$root.session) toastr.error('You must be logged in to do that.');
                    ctrl.hideReplyBox();
                    return;
                }

                ctrl.isActive = true;
                replyBoxScope = $scope.$new();
                replyBox = $compile('<reply-box comment="$ctrl.comment" article="$ctrl.article" hide-fn="$ctrl.hideReplyBox()"></reply-box>')(replyBoxScope);
                $(selector).append(replyBox);
            };

            ctrl.hideReplyBox = function() {
                if(!replyBox) return;
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