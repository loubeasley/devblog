var articlePage = {
    templateUrl: './article-create.html',
    controller: 'ArticleCreateController',
    bindings: {
        article: '<'
    }
};

angular
    .module('components.blog')
    .component('articleCreate', articlePage)
    .config(function ($stateProvider) {
        $stateProvider
            .state('app.article.create', {
                url: '/create',
                component: 'articleCreate',
                /*resolve: {
                    article: function ($transition$, BlogService) {
                        var key = $transition$.params().articleID;
                        return BlogService.getArticleById(key);
                    }
                }*/
                views: {
                    '@app' : {
                        component: 'articleCreate'
                    },
                    widget: {
                        template: 'asdfasdfasdfasdf!!!!'
                    }
                }
            });

    });