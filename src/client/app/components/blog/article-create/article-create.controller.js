function ArticleCreateController(ArticleService, SessionService, marked, $state) {
    var ctrl = this;

    ctrl.articleBody = '';
    ctrl.articleTitle = '';
    ctrl.rightNow = new Date();
    ctrl.currentUser = SessionService.currentSession().username;

    ctrl.$onInit = function $onInit() {
        if(ctrl.article) {
            ctrl.articleBody = ctrl.article.body;
            ctrl.articleTitle = ctrl.article.title;
        }
    };

    ctrl.postArticle = function() {
        if(!SessionService.isAuthenticated()) return toastr.warning('You need to be logged in.');

        var body = {
            title: ctrl.articleTitle || null,
            body: ctrl.articleBody || null,
            userID: SessionService.currentSession().userID || null
        };

        (ctrl.article ?
            ArticleService.updateArticle({articleID: ctrl.article.articleID}, body) :
            ArticleService.postArticle(body))
            .then(function (res) {
                if (res.success) {
                    toastr.success('Article posted successfully!');
                    return $state.go('app.article.view', {articleID: res.results.articleID}, {reload: true});
                }

                toastr.error(res.message || 'Something went wrong!');
                return null;
            });
    }

}

ArticleCreateController.$inject = ['ArticleService', 'SessionService', 'marked', '$state'];

angular
    .module('components.blog')
    .controller('ArticleCreateController', ArticleCreateController);