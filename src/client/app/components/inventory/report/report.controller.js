
class ReportController {
    constructor(ItemService, InventoryService, CycleService, $stateParams, $timeout, $http, $scope) {
        this.ItemService = ItemService;
        this.InventoryService = InventoryService;
        this.CycleService = CycleService;
        this.pageName = 'order';
        this.$scope = $scope;
        this.$http = $http;
    }

    $onInit() {
        this.pageName = 'report';
        this.InventoryService.mode = this.pageName;

        this.$http({
            method: 'GET',
            url: '/api/audit/totals'
        }).then( (res)=> {
            console.log(res);
            this.chart = res.data.results;
            this.cycles = res.data.cycles;

            this.cReport = {
                totalSales: 0,
                totalCost: 0,
                totalLoss: 0,
                totalProfit: 0,
                totalProfitLoss: 0,
                maxProfit: 0,
                capital: 10000
            };

            this.cycles.forEach((cycle)=>{
                this.cReport.totalSales += cycle.total_sales || 0;
                this.cReport.totalCost += cycle.total_cost || 0;
                this.cReport.totalLoss += cycle.total_loss || 0;
                this.cReport.totalProfit += cycle.total_profit || 0;
                this.cReport.totalProfitLoss += cycle.profit_loss || 0;
                this.cReport.maxProfit += cycle.max_profit_from_order || 0;
            });

            console.log(this.cycles);
            console.log(this.cReport);
        });

        if(window.Highcharts && !this.Highcharts) this.Highcharts = window.Highcharts;

        super.$onInit();
    }

    get $inject() {
        return ["ItemService", "InventoryService", 'CycleService', '$stateParams', '$timeout', '$http', '$scope'];
    }

    get currentItems() {
        return this.items;
    }
}

angular.module('components.inventory')
    .controller('ReportController', ReportController);
