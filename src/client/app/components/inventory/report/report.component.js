const report = {
    templateUrl: './report.html',
    require: {
        parent: '^inventory'
    },
    controller: 'ReportController'
};

angular
    .module('components.inventory')
    .component('report', report)
    .config(function ($stateProvider) {
        $stateProvider
            .state('app.inventory.report', {
                url: '/report',
                views: {
                    inventory: {
                        component: 'report'
                    }
                }
            });
    });