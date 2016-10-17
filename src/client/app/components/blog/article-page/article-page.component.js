var articlePage = {
    bindings: {
        'article': '<',
        'comments': '<'
    },
    templateUrl: './article-page.html',
    controller: 'ArticlePageController'
};

angular
    .module('components.blog')
    .component('articlePage', articlePage)
    .config(function ($stateProvider, $urlRouterProvider, $transitionsProvider) {
        $stateProvider
            .state('app.article', {
                abstract: true,
                url: '/article',
                data: {
                    breadcrumbProxy: 'app.blog'
                }
            })
            .state('app.article.view', {
                url: '/{articleID:[0-9]+}',
                component: 'articlePage',
                resolve: {
                    article: function ($transition$, BlogService) {
                        console.log("asdf!!!");
                        var key = $transition$.params().articleID;
                        return BlogService.getArticleById(key);
                    },
                    comments: function ($transition$, BlogService) {
                        var key = $transition$.params().articleID;
                        return BlogService.getCommentsByArticle({
                            articleID: key
                        });
                    }
                },
                views: {
                    '@app' : {
                        component: 'articlePage'
                    }
                },
                data: {
                    displayName: '{{article.articleID}}'
                }
            })
            .state('app.article.view.edit', {
                url: '/edit',
                component: 'articleCreate',
                resolve: {
                    article: function ($transition$, BlogService) {
                        var key = $transition$.params().articleID;
                        return BlogService.getArticleById(key);
                    }
                },
                requiresAdmin: true,
                views: {
                    '@app' : {
                        component: 'articleCreate'
                    }/*,
                    'widget@app': {
                        template: '<ui-breadcrumbs displayname-property="data.displayName" ' +
                        'template-url="./uiBreadcrumbs.tpl.html" abstract-proxy-property="data.breadcrumbProxy"></ui-breadcrumbs>'
                    }*/
                },
                data: {
                    displayName: 'article edit'
                }
            });
    });