class InventoryController {
    constructor(ItemService, InventoryService, $stateParams) {
        this.items = []; //populated by resolve on route
        this.ItemService = ItemService;
        this.InventoryService = InventoryService;
        this.$stateParams = $stateParams;
        this.filter = {};
        this.itemHistory = {};
        this.loading = true;
        this.categories = [];
    }

    get $inject() {
        return ["ItemService", "InventoryService", '$stateParams'];
    }

    get currentItems() {
        return this.items;
    }

    getItem(id) {
        return this.InventoryService.getItem(id);
    }

    $onInit() {
        this.InventoryService.init(this.items);
        this.InventoryService.load();
        this.loading = false;
        this.ItemService.getCategories()
            .then((results)=>{
                this.categories = results;
            });
    }

    handleFilterChange() {
        this.$stateParams.search = JSON.stringify(this.filter);
        this.ItemService.getItems(this.$stateParams)
            .then((result) => {
                this.items = result;
            });
    }

    incrementQuantity(item) {
        item.quantity++;

        let elem = $('#item-slider-' + item._original.item_id);
        if (elem.hasClass('slide-right')) return;
        elem.addClass('slide-right');
        setTimeout(function () {
            elem.removeClass('slide-right');
        }, 300);
    }

    decrementQuantity(item) {
        item.quantity--;

        let elem = $('#item-slider-' + item._original.item_id);
        if (elem.hasClass('slide-left')) return;
        elem.addClass('slide-left');
        setTimeout(function () {
            elem.removeClass('slide-left');
        }, 300);
    }

    handleCommit() {
        this.loading = true;
        return this.InventoryService.commit()
            .then((result) => {
                return this.ItemService.getItems();
            })
            .then((result) => {
                this.items = result;
                this.$onInit();
                this.loading = false;
            });

    }
}


angular.module('components.inventory')
    .controller('InventoryController', InventoryController);
