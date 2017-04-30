class SaleController extends InventoryPageController {
    $onInit() {
        this.pageName = 'sale';
        super.$onInit();
    }
}


angular.module('components.inventory')
    .controller('SaleController', SaleController);
