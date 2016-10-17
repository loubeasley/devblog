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
        if(ctrl.article) return ArticleService.updateArticle({articleID: ctrl.article.articleID},
            {
                title: ctrl.articleTitle,
                body: ctrl.articleBody,
                userID: SessionService.currentSession().userID

            })
            .then(function (res) {
                console.log(res);
                if(res.success) {
                    $state.go('app.article.view', {articleID: ctrl.article.articleID}, {reload: true});
                    toastr.success('Article updated successfully!');
                    ctrl.article = res.results;
                    return;
                }

                toastr.error(res.message || 'Something went wrong!');
            });

        return ArticleService.postArticle({
            title: ctrl.articleTitle,
            body: ctrl.articleBody,
            userID: SessionService.currentSession().userID
        })
            .then(function (res) {
                if(res.success) {
                    $state.go('article', {id: res.results});
                    toastr.success('Article posted successfully!');
                    return;
                }

                toastr.error(res.message || 'Something went wrong!');
            });
    }

}

ArticleCreateController.$inject = ['ArticleService', 'SessionService', 'marked', '$state'];

angular
    .module('components.blog')
    .controller('ArticleCreateController', ArticleCreateController);