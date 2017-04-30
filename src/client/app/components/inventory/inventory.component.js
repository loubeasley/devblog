const inventory = {
    templateUrl: './inventory.html',
    controller: 'InventoryController',
    bindings: {
        items: '<',
        cycle: '<'
    }
};

angular
    .module('components.inventory')
    .component('inventory', inventory)
    .config(function ($stateProvider) {
        $stateProvider
            .state('app.inventory', {
                abstract: true,

                url: '/inventory?sort&page&limit&search',
                resolve: {
                    items: function (ItemService, $stateParams) {
                        return ItemService.getItems($stateParams);
                    },
                    cycle: function(CycleService) {
                        return CycleService.getCurrentCycle();
                    }
                },
                views: {
                    '': {
                        component: 'inventory'
                    },
                    widget: {
                        component: 'inventoryNav'
                    }
                }
            })
            .state('app.inventory.default', {
                url: '',
                redirectTo: 'app.inventory.order'
            });
    });