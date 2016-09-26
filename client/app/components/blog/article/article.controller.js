function ArticleController() {
    var ctrl = this;
    console.log(ctrl);
}

angular
    .module('components.blog')
    .controller('ArticleController', ArticleController);