var aboutPage = {
    templateUrl: './about-page.html',
    controller: 'AboutPageController',
    bindings: {}
};

angular
    .module('components.about-page')
    .component('aboutPage', aboutPage)
    .config(function ($stateProvider) {
        $stateProvider
            .state('app.about', {
                url: '/about',
                component: 'aboutPage',
                params: {},
                resolve: {},
                views: {
                    '': {
                        component: 'aboutPage'
                    }
                }
            });
    });