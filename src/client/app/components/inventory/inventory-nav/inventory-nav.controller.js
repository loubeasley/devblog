class InventoryNavController {
    constructor(InventoryService) {
        this.InventoryService = InventoryService;
    }

    $onInit() {

    }

    get mode() {
        return this.InventoryService.mode;
    }

    set mode(mode) {
        this.InventoryService.mode = mode;
    }

    get $inject() {
        return ['InventoryService'];
    }
}

angular.module('components.inventory')
    .controller('InventoryNavController', InventoryNavController);
