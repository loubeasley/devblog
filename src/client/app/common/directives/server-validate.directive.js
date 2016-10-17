function serverValidate () {
    return {
        restrict: 'A',
        require: 'form',
        link: function ($scope, $elem, $attrs, form) {
            var invalidateField = function (field, errorType) {
                var changeListener = function () {
                    field.$setValidity(errorType, true);

                    var index = field.$viewChangeListeners.indexOf(changeListener);
                    if (index > -1) {
                        field.$viewChangeListeners.splice(index, 1);
                    }
                };

                field.$setDirty();
                field.$setValidity(errorType, false);
                field.$viewChangeListeners.push(changeListener);
            };

            $scope.$watch('serverErrors', function (errors) {
                if (errors) {
                    angular.forEach(errors, function (error) {
                        if(!angular.isArray(error.field))
                            error.field = [error.field];

                        angular.forEach(error.field, function(field) {
                            if (field in form)
                                invalidateField(form[field], 'server.' + error.type);
                        });
                    });
                }
            });
        }
    };
}

angular
    .module('common')
    .directive('serverValidate', serverValidate);