var blog = {
    bindings: {
        articles: '<'
    },
    templateUrl: './blog.html',
    controller: 'BlogController'
};

angular
    .module('components.blog')
    .component('blog', blog)
    .config(function ($stateProvider) {
        $stateProvider
            .state('app.blog', {
                url: '/',
                component: 'blog',
                resolve: {
                    articles: function(BlogService) {
                        return BlogService.getArticles();
                    }
                },
                views: {
                    '' : {
                        component: 'blog'
                    },
                   /* widget: {
                        template: 'asdf'
                    }*/
                },
                data: {
                    displayName: 'blog'
                }


            });
    });