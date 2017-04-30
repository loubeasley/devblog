class InventoryController {
    constructor(ItemService, InventoryService, CycleService, $stateParams, $timeout, $http, $scope) {
        this.items = []; //populated by resolve on route
        this.ItemService = ItemService;
        this.InventoryService = InventoryService;
        this.CycleService = CycleService;
        this.$stateParams = $stateParams;
        this.filter = {};
        this.sort = {};
        this.itemHistory = {};
        this.loading = true;
        this.categories = [];
        this.$timeout = $timeout;
        this.$http = $http;
        this.$scope = $scope;
        this.timeoutID = this.$timeout(()=>{
            this.refresh();

        }, 1000);
    }



    get $inject() {
        return ["ItemService", "InventoryService", 'CycleService', '$stateParams', '$timeout', '$http', '$scope'];
    }

    get currentItems() {
        return this.items;
    }

    get mode() {
        return this.InventoryService.mode;
    }

    getItem(id) {
        return this.InventoryService.getItem(id);
    }

    $onInit() {

        this.CycleService.getCurrentCycle();
        this.InventoryService.init(this.items);
        this.InventoryService.load();
        this.loading = false;
        this.ItemService.getCategories()
            .then((results)=>{
                this.categories = results;
            });



        this.$scope.$on('inventory.mode.change', (e, val)=>{
            /*if(val != "report") return;

            if(window.Highcharts && !this.Highcharts) this.Highcharts = window.Highcharts;

            this.$timeout(()=>{
                console.log(e, val);
                if(
                    this.Highcharts.charts.length > 0 &&
                    this.Highcharts.charts[this.Highcharts.charts.length - 1] &&
                    this.chartInst !== this.Highcharts.charts[this.Highcharts.charts.length - 1]
                )
                    this.chartInst = this.Highcharts.charts[this.Highcharts.charts.length - 1];
            }, 100);*/
        });

        this.onOrderChange();
    }

    refresh() {
        if(this.loading) {
            this.timeout = this.$timeout(()=>{
                this.refresh();
            }, 100000);
            return;
        }
        this.ItemService.getItems()
            .then((results)=>{
                if(!results) {
                    console.log(results);
                    this.timeout = this.$timeout(()=>{
                        this.refresh();
                    }, 100000);
                    return;
                }


                this.InventoryService.refresh(results);

                this.items.forEach((i)=>{
                    i.quantity = this.InventoryService.masterItemCache[i.item_id].quantity;
                });

                this.timeout = this.$timeout(()=>{
                    this.refresh();
                }, 10000);
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
        if(item._changes.quantity === 0 || !item._changes.quantity) return;

        item.quantity++;
        this.InventoryService.save();

        let elem = $('#item-slider-' + item._original.item_id);
        if (elem.hasClass('slide-left')) return;
        elem.addClass('slide-left');
        setTimeout(function () {
            elem.removeClass('slide-left');
        }, 300);
    }

    decrementQuantity(item) {
        if(item._changes.quantity + item.quantity === 0) return;

        item.quantity--;
        this.InventoryService.save();

        let elem = $('#item-slider-' + item._original.item_id);
        if (elem.hasClass('slide-right')) return;
        elem.addClass('slide-right');
        setTimeout(function () {
            elem.removeClass('slide-right');
        }, 300);
    }

    handleReset() {
        this.InventoryService.reset();
        this.loading = true;
        return this.ItemService.getItems()
            .then((result)=>{
                this.items = result;
                this.$onInit();
                toastr.success('Changes were committed successfully!');
            })
            .catch(function(err){
                toastr.error(err.message);
            });
    }

    handleCommit() {
        this.loading = true;
        return this.InventoryService.commit()
            .then((commitedMode) => {
                this.ItemService.getItems()
                    .then((result)=>{
                        this.items = result;
                        this.$onInit();
                        toastr.success('Changes were committed successfully!');
                    });
            })
            .catch(function(err){
                toastr.error(err.message);
            });

    }

    /*get orderTotal() {
        let curHist = this.InventoryService.history['order'];
        let allItems = curHist.allItems;

        let totalcost = 0;
        for(let key in allItems) {
            console.log(allItems[key]._original.cost, allItems[key]._changes.quantity);
            totalcost += (allItems[key]._original.cost * allItems[key]._changes.quantity);
        }

        return totalcost;
    }*/

    onOrderChange() {
        this.InventoryService.save();
        const items = this.InventoryService.getAllItems();
        this.orderTotal = 0;
        for (let key in items) {
            if(items.hasOwnProperty(key) && Object.keys(items[key]._changes).length > 0)
                this.orderTotal += (items[key]._original.cost * items[key]._changes.quantity);
        }

    }
}


angular.module('components.inventory')
    .controller('InventoryController', InventoryController);
