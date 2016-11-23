var articleCommentsChildren = {
    templateUrl: './article-comments-children.html',
    controller: 'ArticleCommentsChildrenController',
    bindings: {
        article: '<',
        comments: '<',
        onPostComment: '&',
        parentId: '<',
        hideBool: '='
    }
};

angular
    .module('components.blog')
    .component('articleCommentsChildren', articleCommentsChildren);