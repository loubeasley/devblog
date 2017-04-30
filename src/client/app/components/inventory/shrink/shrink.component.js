const shrink = {
    templateUrl: './shrink.html',
    require: {
        parent: '^inventory'
    },
    controllerAs: '$shrink',
    controller: function ($scope) {
        this.$onInit = () => {
            this.parent.InventoryService.mode = 'shrink';
            $scope.$ctrl = this.parent;
        }
    }
};

angular
    .module('components.inventory')
    .component('shrink', shrink)
    .config(function ($stateProvider) {
        $stateProvider
            .state('app.inventory.shrink', {
                url: '/shrink',
                views: {
                    inventory: {
                        component: 'shrink'
                    }
                }
            });
    });