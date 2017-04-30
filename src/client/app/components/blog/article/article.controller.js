function ArticleController($state, ArticleService) {
    var ctrl = this;
    //console.log(ctrl);

    ctrl.$onInit = function () {
        //console.log("WE DID THE THINGF");
        //if(ctrl.preview) ctrl.article.body = '';
    };

    ctrl.deleteArticle = function () {
        ArticleService.deleteArticle({articleID: ctrl.article.articleID})
            .then(function(res) {
                $state.go('app.blog', {}, {reload: true})
            })
    }
}

ArticleController.$inject = ['$state', 'ArticleService'];

angular
    .module('components.blog')
    .controller('ArticleController', ArticleController);