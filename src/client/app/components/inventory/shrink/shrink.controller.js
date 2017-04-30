class ShrinkController extends InventoryPageController {
    $onInit() {
        this.pageName = 'shrink';
        super.$onInit();
    }
}


angular.module('components.inventory')
    .controller('ShrinkController', ShrinkController);
