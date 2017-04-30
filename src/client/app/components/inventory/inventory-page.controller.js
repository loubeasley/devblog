class InventoryPageController {
    constructor(ItemService, InventoryService, CycleService, $stateParams, $timeout, $http, $scope) {
        this.ItemService = ItemService;
        this.InventoryService = InventoryService;
        this.CycleService = CycleService;
        this.pageName = 'order';
        this.$scope = $scope;
        this.$http = $http;
    }

    $onInit() {
        this.InventoryService.mode = this.pageName;
    }

    get $inject() {
        return ["ItemService", "InventoryService", 'CycleService', '$stateParams', '$timeout', '$http', '$scope'];
    }

    get currentItems() {
        return this.items;
    }
}

window.InventoryPageController = InventoryPageController;