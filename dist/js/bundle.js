(function(angular){
'use strict';
angular.module('root', [
    'common',
    'components',
    'templates'
]);})(window.angular);
(function(angular){
'use strict';
angular
    .module('common', [
        'ui.router',
        'ngResource',
        'ngAnimate',
        'ngSanitize',
        'angularUtils.directives.uiBreadcrumbs',
        /*'monospaced.elastic',*/
        'hc.marked', 'hljs', 'angular-markdown-editor'])
    .config(['markedProvider', 'hljsServiceProvider', function(markedProvider, hljsServiceProvider) {
        // marked config
        markedProvider.setOptions({
            gfm: true,
            tables: true,
            sanitize: true,
            highlight: function (code, lang) {
                console.log(code, lang);
                if (lang) {
                    try {
                        return hljs.highlight(lang, code, true).value;
                    } catch(e) {
                        return hljs.highlightAuto(code).value;
                    }

                } else {
                    return hljs.highlightAuto(code).value;
                }
            }
        });

        // highlight config
        hljsServiceProvider.setOptions({
            // replace tab with 4 spaces
            tabReplace: '    '
        });
    }]);})(window.angular);
(function(angular){
'use strict';
angular
  .module('components', [
    'components.blog'
  ]);
})(window.angular);
(function(angular){
'use strict';
angular.module('components.blog', ['ui.router']);})(window.angular);
(function(angular){
'use strict';
var root = {
    templateUrl: './root.html'

};

angular
    .module('root')
    .component('root', root);
})(window.angular);
(function(angular){
'use strict';
function SessionService($http, $rootScope) {
    var session = null;
    function updateSession(newSession) {
        session = newSession;
        $rootScope.session = session;
        return session;
    }

    return {
        getSession: function() {
            return $http.get('/api/session')
                .then(function(response) {
                    return updateSession(response.data.session);
                });
        },
        login: function(loginObj) {
            return $http.post('/api/session/login', loginObj)
                .then(function(response) {
                    return updateSession(response.data.user);
                });
        },
        logout: function() {
            return $http.get('/api/session/logout')
                .then(function() {
                    return updateSession(null);
                });
        },
        currentSession: function () {
            return session;
        }
    }
}

SessionService.$inject = ['$http', '$rootScope'];

angular
    .module('common')
    .factory('SessionService', SessionService);})(window.angular);
(function(angular){
'use strict';
var appNav = {
    templateUrl: './app-nav.html',
    controller: 'AppNavController',
    bindings: {
        session: '='
    }
};

angular
    .module('common')
    .component('appNav', appNav);})(window.angular);
(function(angular){
'use strict';
var AppNavController = function($http, sessionService) {
    var ctrl = this;
    ctrl.login = {
        username: null,
        password: null,
        remember: false
    };
    ctrl.submit = function() {
        sessionService.login(ctrl.login)
            .then(function(result) {
                ctrl.session = result;
            });
    };
    ctrl.logout = function() {
        sessionService.logout()
            .then(function() {
                ctrl.session = null;
            });
    };
};

AppNavController.$inject = ['$http', 'SessionService'];

angular
    .module('common')
    .controller('AppNavController', AppNavController);})(window.angular);
(function(angular){
'use strict';
var app = {
    templateUrl: './app.html',
    controller: 'AppController',
    bindings: {
        session: '<'
    }
};

angular
    .module('common')
    .component('app', app)
    .config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('app', {
                abstract: true,
                redirectTo: 'blog',
                data: {
                    requiredAuth: true
                },
                component: 'app',
                resolve: {
                    session: ["SessionService", function(SessionService) {
                        return SessionService.getSession();
                    }]
                }
            });

        $urlRouterProvider.otherwise('/');
    }]);})(window.angular);
(function(angular){
'use strict';
AppController.$inject = ["$state"];
function AppController($state) {
    var ctrl = this;
    console.log(ctrl);
}

angular
    .module('common')
    .controller('AppController', AppController);})(window.angular);
(function(angular){
'use strict';
angular.module('monospaced.elastic', [])

    .constant('msdElasticConfig', {
        append: ''
    })

    .directive('msdElastic', [
        '$timeout', '$window', 'msdElasticConfig',
        function($timeout, $window, config) {
            'use strict';

            return {
                require: 'ngModel',
                restrict: 'A, C',
                link: function(scope, element, attrs, ngModel) {

                    // cache a reference to the DOM element
                    var ta = element[0],
                        $ta = element;

                    // ensure the element is a textarea, and browser is capable
                    if (ta.nodeName !== 'TEXTAREA' || !$window.getComputedStyle) {
                        return;
                    }

                    // set these properties before measuring dimensions
                    $ta.css({
                        'overflow': 'hidden',
                        'overflow-y': 'hidden',
                        'word-wrap': 'break-word'
                    });

                    // force text reflow
                    var text = ta.value;
                    ta.value = '';
                    ta.value = text;

                    var append = attrs.msdElastic ? attrs.msdElastic.replace(/\\n/g, '\n') : config.append,
                        $win = angular.element($window),
                        mirrorInitStyle = 'position: absolute; top: -999px; right: auto; bottom: auto;' +
                            'left: 0; overflow: hidden; -webkit-box-sizing: content-box;' +
                            '-moz-box-sizing: content-box; box-sizing: content-box;' +
                            'min-height: 0 !important; height: 0 !important; padding: 0;' +
                            'word-wrap: break-word; border: 0;',
                        $mirror = angular.element('<textarea aria-hidden="true" tabindex="-1" ' +
                            'style="' + mirrorInitStyle + '"/>').data('elastic', true),
                        mirror = $mirror[0],
                        taStyle = getComputedStyle(ta),
                        resize = taStyle.getPropertyValue('resize'),
                        borderBox = taStyle.getPropertyValue('box-sizing') === 'border-box' ||
                            taStyle.getPropertyValue('-moz-box-sizing') === 'border-box' ||
                            taStyle.getPropertyValue('-webkit-box-sizing') === 'border-box',
                        boxOuter = !borderBox ? {width: 0, height: 0} : {
                            width:  parseInt(taStyle.getPropertyValue('border-right-width'), 10) +
                            parseInt(taStyle.getPropertyValue('padding-right'), 10) +
                            parseInt(taStyle.getPropertyValue('padding-left'), 10) +
                            parseInt(taStyle.getPropertyValue('border-left-width'), 10),
                            height: parseInt(taStyle.getPropertyValue('border-top-width'), 10) +
                            parseInt(taStyle.getPropertyValue('padding-top'), 10) +
                            parseInt(taStyle.getPropertyValue('padding-bottom'), 10) +
                            parseInt(taStyle.getPropertyValue('border-bottom-width'), 10)
                        },
                        minHeightValue = parseInt(taStyle.getPropertyValue('min-height'), 10),
                        heightValue = parseInt(taStyle.getPropertyValue('height'), 10),
                        minHeight = Math.max(minHeightValue, heightValue) - boxOuter.height,
                        maxHeight = parseInt(taStyle.getPropertyValue('max-height'), 10),
                        mirrored,
                        active,
                        copyStyle = ['font-family',
                            'font-size',
                            'font-weight',
                            'font-style',
                            'letter-spacing',
                            'line-height',
                            'text-transform',
                            'word-spacing',
                            'text-indent'];

                    // exit if elastic already applied (or is the mirror element)
                    if ($ta.data('elastic')) {
                        return;
                    }

                    // Opera returns max-height of -1 if not set
                    maxHeight = maxHeight && maxHeight > 0 ? maxHeight : 9e4;

                    // append mirror to the DOM
                    if (mirror.parentNode !== document.body) {
                        angular.element(document.body).append(mirror);
                    }

                    // set resize and apply elastic
                    $ta.css({
                        'resize': (resize === 'none' || resize === 'vertical') ? 'none' : 'horizontal'
                    }).data('elastic', true);

                    /*
                     * methods
                     */

                    function initMirror() {
                        var mirrorStyle = mirrorInitStyle;

                        mirrored = ta;
                        // copy the essential styles from the textarea to the mirror
                        taStyle = getComputedStyle(ta);
                        angular.forEach(copyStyle, function(val) {
                            mirrorStyle += val + ':' + taStyle.getPropertyValue(val) + ';';
                        });
                        mirror.setAttribute('style', mirrorStyle);
                    }

                    function adjust() {
                        var taHeight,
                            taComputedStyleWidth,
                            mirrorHeight,
                            width,
                            overflow;

                        if (mirrored !== ta) {
                            initMirror();
                        }

                        // active flag prevents actions in function from calling adjust again
                        if (!active) {
                            active = true;

                            mirror.value = ta.value + append; // optional whitespace to improve animation
                            mirror.style.overflowY = ta.style.overflowY;

                            taHeight = ta.style.height === '' ? 'auto' : parseInt(ta.style.height, 10);

                            taComputedStyleWidth = getComputedStyle(ta).getPropertyValue('width');

                            // ensure getComputedStyle has returned a readable 'used value' pixel width
                            if (taComputedStyleWidth.substr(taComputedStyleWidth.length - 2, 2) === 'px') {
                                // update mirror width in case the textarea width has changed
                                width = parseInt(taComputedStyleWidth, 10) - boxOuter.width;
                                mirror.style.width = width + 'px';
                            }

                            mirrorHeight = mirror.scrollHeight;

                            if (mirrorHeight > maxHeight) {
                                mirrorHeight = maxHeight;
                                overflow = 'scroll';
                            } else if (mirrorHeight < minHeight) {
                                mirrorHeight = minHeight;
                            }
                            mirrorHeight += boxOuter.height;
                            ta.style.overflowY = overflow || 'hidden';

                            if (taHeight !== mirrorHeight) {
                                scope.$emit('elastic:resize', $ta, taHeight, mirrorHeight);
                                ta.style.height = mirrorHeight + 'px';
                            }

                            // small delay to prevent an infinite loop
                            $timeout(function() {
                                active = false;
                            }, 1, false);

                        }
                    }

                    function forceAdjust() {
                        active = false;
                        adjust();
                    }

                    /*
                     * initialise
                     */

                    // listen
                    if ('onpropertychange' in ta && 'oninput' in ta) {
                        // IE9
                        ta['oninput'] = ta.onkeyup = adjust;
                    } else {
                        ta['oninput'] = adjust;
                    }

                    $win.bind('resize', forceAdjust);

                    scope.$watch(function() {
                        return ngModel.$modelValue;
                    }, function(newValue) {
                        forceAdjust();
                    });

                    scope.$on('elastic:adjust', function() {
                        initMirror();
                        forceAdjust();
                    });

                    $timeout(adjust, 0, false);

                    /*
                     * destroy
                     */

                    scope.$on('$destroy', function() {
                        $mirror.remove();
                        $win.unbind('resize', forceAdjust);
                    });
                }
            };
        }
    ]);})(window.angular);
(function(angular){
'use strict';
function BlogService($resource) {
    var Article = $resource('/api/article/:id', {articleID: '@id'});
    var Comments = $resource('/api/comments');
    return {
        getArticles: function() {
            return Article.get().$promise
                .then(function (result) {
                    if(result.success) return result.results;

                    return [];
                });
        },
        getArticleById: function (key) {
            console.log(key);
            return Article.get({id: key}).$promise
                .then(function (result) {
                    if(result.success) return result.results;

                    console.log(result);

                    return [];
                });
        },
        getCommentsByArticle: function(obj) {
            if(!obj.parentID) obj.parentID = null;

            return Comments.get(obj).$promise
                .then(function (result) {
                    console.log(result);
                    if(result.success) return result;

                    return [];
                });
        },
        postCommentForArticle: function(data) {

            return Comments.save(data).$promise
                .then(function (result) {
                    if(result.success) return result.results;

                    return [];
                });
        },
        postArticle: function(data) {
            return Article.save(data).$promise
                .then(function (result) {
                    return result;
                });
        }
    }
}

BlogService.$inject = ['$resource'];

angular
    .module('components.blog')
    .factory('BlogService', BlogService);})(window.angular);
(function(angular){
'use strict';
var article = {
    bindings: {
        'article': '<'
    },
    templateUrl: './article.html',
    controller: 'ArticleController'
};

angular
    .module('components.blog')
    .component('article', article);})(window.angular);
(function(angular){
'use strict';
function ArticleController() {
    var ctrl = this;
    console.log(ctrl);
}

angular
    .module('components.blog')
    .controller('ArticleController', ArticleController);})(window.angular);
(function(angular){
'use strict';
function ArticleService($resource) {
    var Article = $resource('/api/article/:articleID', null,
        {
            'update': { method: 'PUT' }
        }
    );
    return {
        getArticles: function() {
            return Article.get().$promise
                .then(function (result) {
                    if(result.success) return result.results;

                    return [];
                });
        },
        getArticleById: function (key) {
            return Article.get({articleID: key}).$promise
                .then(function (result) {
                    if(result.success) return result.results;

                    console.log(result);

                    return [];
                });
        },
        postArticle: function(data) {
            return Article.save(data).$promise
        },
        updateArticle: function(id, data) {
            return Article.update(id, data).$promise
        }
    }
}

ArticleService.$inject = ['$resource'];

angular
    .module('components.blog')
    .factory('ArticleService', ArticleService);})(window.angular);
(function(angular){
'use strict';
var articleCommentsChildren = {
    templateUrl: './article-comments-children.html',
    controller: 'ArticleCommentsChildrenController',
    bindings: {
        article: '<',
        comments: '<',
        onPostComment: '&',
        parentId: '<'
    }
};

angular
    .module('components.blog')
    .component('articleCommentsChildren', articleCommentsChildren);})(window.angular);
(function(angular){
'use strict';
function ArticleCommentsChildrenController (BlogService, SessionService) {
    var ctrl = this;



    ctrl.$onInit = function() {
        console.log(ctrl);
        /*BlogService.getCommentsByArticle({
            articleID: ctrl.article.articleID,
            parentID: ctrl.parentId
        })
            .then(function(response) {
                console.log(response);
                ctrl.comments = response.results || [];
            });*/
    };

    ctrl.postComment = function() {
        if(ctrl.pendingComment.length == 0 || ctrl.pendingComment.length > 255) return;

        BlogService.postCommentForArticle({
            articleID: ctrl.article.articleID,
            body: ctrl.pendingComment,
            userID: SessionService.currentSession().userID
        })
            .then(function (results) {
                console.log(results);
                ctrl.comments.unshift(results);
            });
    }

}

ArticleCommentsChildrenController.$inject = ['BlogService', 'SessionService'];

angular
    .module('components.blog')
    .controller('ArticleCommentsChildrenController', ArticleCommentsChildrenController);})(window.angular);
(function(angular){
'use strict';
var articleComments = {
    templateUrl: './article-comments.html',
    controller: 'ArticleCommentsController',
    bindings: {
        article: '<',
        comments: '<'
    }
};

angular
    .module('components.blog')
    .component('articleComments', articleComments);})(window.angular);
(function(angular){
'use strict';
function ArticleCommentsController (BlogService, SessionService, marked, $scope) {
    var ctrl = this;

    ctrl.$onInit = function() {
        $scope.$on('updateComments', function(event, data) {
            event.stopPropagation();
            /*ctrl.comments.unshift(data.comment);*/
        });

        ctrl.sortComments();
    };

    ctrl.postComment = function() {
        BlogService.postCommentForArticle({
            articleID: ctrl.article.articleID,
            body: ctrl.pendingComment,
            userID: SessionService.currentSession().userID
        })
            .then(function (results) {
                console.log(results);
                ctrl.comments.unshift(results);
            });
    };

    ctrl.sortComments = function() {
        function getChildComments(parentComment, callback) {
            // Mock asynchronous implementation, for testing the rest of the code
            var children = ctrl.comments.filter(function (comment) {

                return comment.parentID == parentComment.commentID;
            });

            callback(null, children);
        }

        var container = {}; // dummy node to collect complete hierarchy into
        getBlock([container], function rootCallback(){
            ctrl.comments = container.replies;
        });

        function getBlock(comments, callback) {
            if (!comments || !comments.length) {
                // Nothing to do, call back synchronously
                callback(comments);
                return;
            }
            var leftOver = comments.length;
            comments.forEach(function commentIter(comment) {
                getChildComments(comment, function getChildCommentCallback(err, children) {
                    comment.replies = children;
                    // provide custom callback:
                    getBlock(children, function getBlockCallback() {
                        // only call parent's callback when all is done here:
                        if (--leftOver === 0) callback(comments);
                    });
                });
            });
        }
    }

}

ArticleCommentsController.$inject = ['BlogService', 'SessionService', 'marked', '$scope'];

angular
    .module('components.blog')
    .controller('ArticleCommentsController', ArticleCommentsController);})(window.angular);
(function(angular){
'use strict';
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
    .config(["$stateProvider", function ($stateProvider) {
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

    }]);})(window.angular);
(function(angular){
'use strict';
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
                if(res.success) {
                    $state.go('app.article.view', {articleID: ctrl.article.articleID});
                    toastr.success('Article updated successfully!');
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
    .controller('ArticleCreateController', ArticleCreateController);})(window.angular);
(function(angular){
'use strict';
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
    .config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
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
                    article: ["$transition$", "BlogService", function ($transition$, BlogService) {
                        var key = $transition$.params().articleID;
                        return BlogService.getArticleById(key);
                    }],
                    comments: ["$transition$", "BlogService", function ($transition$, BlogService) {
                        var key = $transition$.params().articleID;
                        return BlogService.getCommentsByArticle({
                            articleID: key
                        });
                    }]
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
                    article: ["$transition$", "BlogService", function ($transition$, BlogService) {
                        var key = $transition$.params().articleID;
                        return BlogService.getArticleById(key);
                    }]
                },
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

        /*$urlRouterProvider.when('/article/:articleID', ['$match', '$state', function($match, $state) {
            if($match.articleID === ""){
                $state.go("blog");
            }
        }
        ]);*/
    }]);})(window.angular);
(function(angular){
'use strict';
function ArticlePageController(BlogService, SessionService, $http) {
    var ctrl = this;
    console.log(ctrl);
    ctrl.pendingComment = '';


}

ArticlePageController.$inject = ['BlogService', 'SessionService', '$http'];

angular
    .module('components.blog')
    .controller('ArticlePageController', ArticlePageController);})(window.angular);
(function(angular){
'use strict';
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
    .config(["$stateProvider", function ($stateProvider) {
        $stateProvider
            .state('app.blog', {
                url: '/',
                component: 'blog',
                resolve: {
                    articles: ["BlogService", function(BlogService) {
                        return BlogService.getArticles();
                    }]
                },
                views: {
                    '' : {
                        component: 'blog'
                    },
                    widget: {
                        template: 'asdf'
                    }
                },
                data: {
                    displayName: 'blog'
                }


            });
    }]);})(window.angular);
(function(angular){
'use strict';
function blogController() {
    var ctrl = this;

    ctrl.$onInit = function() {
        ctrl.articles = ctrl.articles.reverse();
    }
}

angular
    .module('components.blog')
    .controller('BlogController', blogController);})(window.angular);
(function(angular){
'use strict';
var replyBox = {
    bindings: {
        comment: '<',
        article: '<',
        hideFn: '&'
    },
    templateUrl: './reply-box.html',
    controller: function ($scope, BlogService, SessionService) {
        var ctrl = this;
        ctrl.pendingComment = '';

        ctrl.$onDestroy = function() {
            console.log("DESTROY");
        };

        ctrl.postComment = function() {
            BlogService.postCommentForArticle({
                articleID: ctrl.article.articleID,
                body: ctrl.pendingComment,
                userID: SessionService.currentSession().userID,
                parentID: ctrl.comment.commentID
            })
                .then(function (results) {
                    if(!ctrl.comment.replies) ctrl.comment.replies = [];
                    ctrl.comment.replies.push(results);
                    ctrl.hideFn();
                    $scope.$emit('updateComments', {
                        article: ctrl.article,
                        parent: ctrl.comment,
                        comment: results
                    })
                });
        }
    }
};

angular
    .module('components.blog')
    .component('replyBox', replyBox);})(window.angular);
(function(angular){
'use strict';
function replyButton() {
    return {
        restrict: 'E',
        template: '<a ng-click="$ctrl.addReplyBox()">reply</a>',
        controllerAs: '$ctrl',
        scope: {
            comment: '<',
            article: '<'
        },
        bindToController: true,
        controller: ["$scope", "$element", "$compile", function($scope, $element, $compile) {
            var ctrl = this;
            var selector = '#commentid-' + ctrl.comment.commentID + '-reply-box';
            var replyBox = null;
            var replyBoxScope = null;

            ctrl.isActive = false;
            ctrl.addReplyBox = function addReplyBox() {
                if(ctrl.isActive) {
                    ctrl.hideReplyBox();
                    return;
                }

                ctrl.isActive = true;
                replyBoxScope = $scope.$new();
                replyBox = $compile('<reply-box comment="$ctrl.comment" article="$ctrl.article" hide-fn="$ctrl.hideReplyBox()"></reply-box>')(replyBoxScope);
                $(selector).append(replyBox);
            };

            ctrl.hideReplyBox = function() {
                $(replyBox).remove();
                replyBoxScope.$destroy();
                replyBoxScope = null;
                replyBox = null;
                ctrl.isActive = false;
            }


        }]
    }
}

angular
    .module('components.blog')
    .directive('replyButton', replyButton);})(window.angular);
(function(angular){
'use strict';
angular.module('templates', []).run(['$templateCache', function($templateCache) {$templateCache.put('./root.html','<div class="root"><div ui-view></div></div>');
$templateCache.put('./app-nav.html','<nav class="navbar navbar-inverse navbar-fixed-top"><div class="container"><!-- Brand and toggle get grouped for better mobile display --><div class="navbar-header"><button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false"><span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span></button> <a class="navbar-brand" href="#">Brand</a></div><div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1"><ul class="nav navbar-nav"><li ui-sref-active="active"><a ui-sref=".blog">Blog</a></li><li><a href="#">About</a></li></ul><ul class="nav navbar-nav navbar-right"><li ng-show="$ctrl.session != null" class="dropdown"><a class="text-primary" data-toggle="dropdown">Welcome, {{$ctrl.session.username}}!</a><ul class="dropdown-menu"><li><a>haspm!!!</a></li><li><a>haspm!!!</a></li></ul></li><li><a href="#" ng-click="$ctrl.logout()" ng-show="$ctrl.session != null">Log out</a></li><li><a href="http://www.jquery2dotnet.com" ng-hide="$ctrl.session != null">Sign Up</a></li><li class="dropdown" ng-hide="$ctrl.session != null"><a href="http://www.jquery2dotnet.com" class="dropdown-toggle" data-toggle="dropdown">Sign in <b class="caret"></b></a><ul class="dropdown-menu" style="padding: 15px;min-width: 250px"><li><div class="row"><div class="col-md-12"><form class="form" role="form" accept-charset="UTF-8" id="login-nav"><div class="form-group"><label class="sr-only" for="exampleInputEmail2">Email address</label><input ng-model="$ctrl.login.username" type="text" class="form-control" id="exampleInputEmail2" placeholder="Email address" required=""></div><div class="form-group"><label class="sr-only" for="exampleInputPassword2">Password</label><input ng-model="$ctrl.login.password" type="password" class="form-control" id="exampleInputPassword2" placeholder="Password" required=""></div><div class="checkbox"><label><input type="checkbox"> Remember me</label></div><div class="form-group"><button type="submit" class="btn btn-success btn-block" ng-click="$ctrl.submit()">Sign in</button></div></form></div></div></li><li class="divider"></li><li><a href="/api/session/facebook">facebook</a> <input class="btn btn-primary btn-block" type="button" id="sign-in-google" value="Sign In with Facebook" href="/api/session/facebook"> <input class="btn btn-primary btn-block" type="button" id="sign-in-twitter" value="Sign In with Twitter"></li></ul></li></ul></div></div><!-- /.container-fluid --></nav><div class="splash-bg"></div><div class="logo"><img src="./img/logo.png"></div>');
$templateCache.put('./app.html','<div class="root"><app-nav session="$ctrl.session"></app-nav><div ui-view="widget"></div><div class="app"><main class="container"><div class="blog-content"><div ui-view></div></div></main></div><!--<div class="row">\r\n        <div class="col-md-12 col-lg-6">\r\n            <label for="comment">Live Markdown with <a href="http://www.codingdrama.com/bootstrap-markdown/">Bootstrap-Markdown Editor</a>:</label>\r\n            <textarea name="content" markdown-editor="{\'iconlibrary\': \'fa\', addExtraButtons: true, resize: \'vertical\'}" rows="10" ng-model="markdown"></textarea>\r\n        </div>\r\n        <div class="col-md-12 col-lg-6 fill">\r\n            <div class="form-group">\r\n                <label for="comment">Preview Result:</label>\r\n                <div marked="markdown" class="outline" style="padding: 20px">\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>--></div>');
$templateCache.put('./uiBreadcrumbs.tpl.html','<ol class="breadcrumb"><li ng-repeat="crumb in breadcrumbs" ng-class="{ active: $last }"><a ui-sref="{{ crumb.route }}" ng-if="!$last">{{ crumb.displayName }}&nbsp;</a><span ng-show="$last">{{ crumb.displayName }}</span></li></ol>');
$templateCache.put('./article.html','<header class="row"><div class="avatar col-md-1"><img src="./img/frakshead.png"></div><div class="article-title col-md-11"><a ui-sref="app.article.view({articleID: $ctrl.article.articleID})">{{::$ctrl.article.title || \'NO TITLE\'}}</a></div><div class="article-info col-md-11">Posted on {{::$ctrl.article.createdAt | date}} by <a>{{::$ctrl.article.user.username}}</a><div class="article-admin-ctrl" ng-if="$root.session.userID"><button class="btn btn-primary btn-xs" title="edit" ui-sref="app.article.view.edit({articleID: $ctrl.article.articleID})"><span class="fa fa-pencil"></span></button> <button class="btn btn-danger btn-xs" title="remove"><span class="fa fa-trash"></span></button></div></div></header><div class="article-content"><p marked="::$ctrl.article.body"></p><!--<div style="position: relative">\r\n        <p ng-bind-html="::$ctrl.article.body"></p>\r\n        <div class="fadeout" ng-if="$ctrl.article.body.length > 200"></div>\r\n    </div>\r\n    <div class="article-continue" ng-if="$ctrl.article.body.length > 200">\r\n        <a ui-sref="article({id: $ctrl.article.articleID })">Continue reading...</a>{{$ctrl.article.articleID}}\r\n    </div>--><div class="article-continue text-right"><a ui-sref="app.article.view({articleID: $ctrl.article.articleID})">Comments \xBB</a></div></div><!--\r\n<div class="article-comments text-right">\r\n    <a>34 Comments</a>\r\n</div>-->');
$templateCache.put('./article-create.html','<header class="row"><div class="avatar col-md-1"><img src="./img/frakshead.png"></div><div class="article-title col-md-11"><input class="form-control" placeholder="Enter title here..." ng-model="$ctrl.articleTitle"></div><div class="article-info col-md-11">Posted on {{$ctrl.rightNow | date}} by <a>{{::$ctrl.currentUser}}</a></div></header><div class="comment-create"><textarea placeholder="Body of article..." data-ng-model="$ctrl.articleBody" id="first" data-ng-show="show" ng-init="show = true" markdown-editor="{\'iconlibrary\': \'fa\', addExtraButtons: true, resize: \'vertical\'}">\r\n    </textarea></div><button class="btn btn-sm btn-default right" ng-click="$ctrl.postArticle()">Post</button><div class="clearfix"></div>');
$templateCache.put('./article-comments-children.html','<div class="children" ng-if="$ctrl.comments.length > 0"><div class="comment" ng-repeat="comment in $ctrl.comments"><div class="caption" ng-click="comment.try = !comment.try"><div class="comment-body" ng-class="::{\'user-comment\' : comment.userID == $root.session.userID}"><div class="author"><a>{{::comment.user.username}}</a><span class="comment-spacer">{{::comment.createdAt | date:\'short\'}}</span></div><span ng-bind-html="::comment.body"></span><div class="text-right"><reply-button comment="comment" article="$ctrl.article"></reply-button></div></div><!--<span ng-if="::comment.replyCount > 0">{{comment.replyCount}} replies</span>--></div><div id="{{\'commentid-\' + comment.commentID + \'-reply-box\'}}"></div><span><article-comments-children article="$ctrl.article" comments="comment.replies" parent-id="comment.commentID"></article-comments-children></span></div></div>');
$templateCache.put('./article-comments.html','<div class="comments-container"><div class="comment-create"><textarea placeholder="Write a comment..." data-ng-model="$ctrl.pendingComment" id="first" data-ng-show="show" ng-init="show = true" markdown-editor="{\'iconlibrary\': \'fa\', addExtraButtons: true, resize: \'vertical\'}">\r\n        </textarea><div class="comment-create-footer"><button class="btn-sm btn btn-default right" ng-click="$ctrl.postComment()" ng-init="thing = 0">Post</button><div class="clearfix"></div></div></div><!--<div class="comment-info">{{$ctrl.comments.total}} COMMENTS</div>--><article-comments-children article="$ctrl.article" comments="$ctrl.comments" on-post-comment="$ctrl.postComment" parent-id="root">wut</article-comments-children></div>');
$templateCache.put('./article-page.html','<article data-article="$ctrl.article" ng-init="article=$ctrl.article"></article><article-comments data-article="$ctrl.article" data-comments="$ctrl.comments.results"></article-comments><!--<nav aria-label="Page navigation">\r\n    <ul class="pagination">\r\n        <li>\r\n            <a href="#" aria-label="Previous">\r\n                <span aria-hidden="true">&laquo;</span>\r\n            </a>\r\n        </li>\r\n        <li><a href="#">1</a></li>\r\n        <li><a href="#">2</a></li>\r\n        <li><a href="#">3</a></li>\r\n        <li><a href="#">4</a></li>\r\n        <li><a href="#">5</a></li>\r\n        <li>\r\n            <a href="#" aria-label="Next">\r\n                <span aria-hidden="true">&raquo;</span>\r\n            </a>\r\n        </li>\r\n    </ul>\r\n</nav>-->');
$templateCache.put('./blog.html','<article ng-repeat="article in $ctrl.articles track by article.articleID" data-article="article"></article>');
$templateCache.put('./reply-box.html','<div class="reply-box-cancel-btn" ng-click="$ctrl.hideFn({})"><span class="fa fa-remove"></span></div><div class="comment-create"><textarea placeholder="Write a comment..." data-ng-model="$ctrl.pendingComment" markdown-editor="{\'iconlibrary\': \'fa\', addExtraButtons: true, resize: \'vertical\', fullscreen: {enable: false}}">\r\n        </textarea><div class="comment-create-footer"><button class="btn-sm btn btn-default right" ng-click="$ctrl.postComment()" ng-init="thing = 0">Post</button><div class="clearfix"></div></div></div>');}]);})(window.angular);