const sale = {
    templateUrl: './sale.html',
    require: {
        parent: '^inventory'
    },
    controller: function ($scope) {
        this.$onInit = () => {
            this.parent.InventoryService.mode = 'sale';
            $scope.$ctrl = this.parent;

        }
    }
};

angular
    .module('components.inventory')
    .component('sale', sale)
    .config(function ($stateProvider) {
        $stateProvider
            .state('app.inventory.sale', {
                url: '/sale',
                views: {
                    inventory: {
                        component: 'sale'
                    }
                }
            });
    });