class OrderController extends InventoryPageController {
    $onInit() {
        this.pageName = 'order';
        super.$onInit.call(this);
    }
}


angular.module('components.inventory')
    .controller('OrderController', OrderController);
