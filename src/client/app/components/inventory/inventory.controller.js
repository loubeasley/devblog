class InventoryController {
    constructor(ItemService, InventoryService, $stateParams) {
        this.items = []; //populated by resolve on route
        this.ItemService = ItemService;
        this.InventoryService = InventoryService;
        this.$stateParams = $stateParams;
        this.filter = {};
        this.sort = {};
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

    toggleSort(prop) {
        if(!prop) return;

        if(this.sort === prop + ' ASC')
            this.sort = prop + ' DESC';
        else
            this.sort = prop + ' ASC';

        this.handleFilterChange();
    }

    clearFilterItem(prop, reload = true) {
        if(!this.filter[prop]) return;

        this.filter[prop] = null;
        delete this.filter[prop];

        if(reload) this.handleFilterChange();
    }

    handleFilterChange() {
        this.$stateParams.sort = this.sort;
        this.$stateParams.search = JSON.stringify(this.filter);
        console.log(this.$stateParams);
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
                toastr.success('Changes were committed successfully!');
            })
            .catch(function(err){
                toastr.error(err.message);
            });

    }
}


angular.module('components.inventory')
    .controller('InventoryController', InventoryController);
