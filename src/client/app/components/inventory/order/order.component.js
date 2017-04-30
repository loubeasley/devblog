const order = {
    templateUrl: './order.html',
    require: {
        parent: '^inventory'
    },
    controller: function ($scope) {
        this.$onInit = () => {
            this.parent.InventoryService.mode = 'order';
            $scope.$ctrl = this.parent;

        }
    }
};

angular
    .module('components.inventory')
    .component('order', order)
    .config(function ($stateProvider) {
        $stateProvider
            .state('app.inventory.order', {
                url: '/order',
                views: {
                    inventory: {
                        component: 'order'
                    }
                }
            });
    });