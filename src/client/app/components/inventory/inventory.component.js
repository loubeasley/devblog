const inventory = {
    templateUrl: './inventory.html',
    controller: 'InventoryController',
    bindings: {
        items: '<'
    }
};

angular
    .module('components.inventory')
    .component('inventory', inventory)
    .config(function ($stateProvider) {
        $stateProvider
            .state('app.inventory', {
                url: '/inventory?sort&page&limit&search',
                component: 'inventory',
                resolve: {
                    items: function (ItemService, $stateParams) {
                        return ItemService.getItems($stateParams);
                    }
                },
                views: {
                    '': {
                        component: 'inventory'
                    },
                    widget: {
                        template: `
                            
                        `
                    }
                }
            });
    });