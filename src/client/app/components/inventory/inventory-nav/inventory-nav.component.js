const inventoryNav = {
    templateUrl: './inventory-nav.html',
    controller: 'InventoryNavController',
    bindings: {
        current_cycle: '<'
    }
};

angular
    .module('components.inventory')
    .component('inventoryNav', inventoryNav);