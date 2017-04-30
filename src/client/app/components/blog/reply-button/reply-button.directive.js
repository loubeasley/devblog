function replyButton() {
    return {
        restrict: 'E',
        templateUrl: './reply-button.html',
        controllerAs: '$ctrl',
        scope: {
            comment: '<',
            article: '<',
            onPost: '&'
        },
        bindToController: true,
        controller: function($scope, $element, $compile) {
            const $ctrl = this;

            $ctrl.isActive = false;
            $ctrl.addReplyBox = function addReplyBox() {
                if($ctrl.isActive || !$scope.$root.session) {
                    if(!$scope.$root.session) toastr.error('You must be logged in to do that.');
                    ctrl.hideReplyBox();
                    return;
                }

                $ctrl.isActive = true;
                $ctrl.replyBoxScope = $scope.$new();
                $ctrl.replyBox = $compile('<reply-box comment="$ctrl.comment" article="$ctrl.article" hide-fn="$ctrl.hideReplyBox()"></reply-box>')($ctrl.replyBoxScope);
                $($ctrl.selector).append($ctrl.replyBox);
            };

            $ctrl.hideReplyBox = function() {
                if(!$ctrl.replyBox) return;
                $($ctrl.replyBox).remove();
                $ctrl.replyBoxScope.$destroy();
                $ctrl.replyBoxScope = null;
                $ctrl.replyBox = null;
                $ctrl.isActive = false;
            };

            $ctrl.$onInit = function() {
                $ctrl.selector = '#commentid-' + $ctrl.comment.commentID + '-reply-box';
                $ctrl.replyBox = null;
                $ctrl.replyBoxScope = null;
            };
        }
    }
}

angular
    .module('components.blog')
    .directive('replyButton', replyButton);