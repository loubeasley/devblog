(function(angular){
'use strict';
'use strict';

angular.module('root', ['common', 'components', 'templates']).run(["$rootScope", "$state", "$stateParams", "SessionService", "AuthorizeService", function ($rootScope, $state, $stateParams, SessionService, AuthorizeService) {
    $rootScope.$on('$locationChangeSuccess', function (event, toState, toStateParams) {
        $rootScope.toState = toState;
        $rootScope.toStateParams = toStateParams;
    });
}]);})(window.angular);
(function(angular){
'use strict';
'use strict';

angular.module('common', ['ui.router', 'ngResource', 'ngAnimate', 'ngSanitize', 'ngMessages', 'ngTouch', 'directives', 'angularUtils.directives.uiBreadcrumbs',
/*'monospaced.elastic',*/
'hc.marked', 'hljs', 'angular-markdown-editor', 'duScroll']).config(['markedProvider', 'hljsServiceProvider', function (markedProvider, hljsServiceProvider) {
    // marked config
    markedProvider.setOptions({
        gfm: true,
        tables: true,
        sanitize: true,
        highlight: function highlight(code, lang) {
            if (lang) {
                try {
                    return hljs.highlight(lang, code, true).value;
                } catch (e) {
                    return hljs.highlightAuto(code).value;
                }
            } else {
                return hljs.highlightAuto(code).value;
            }
        }
    });

    markedProvider.setRenderer({
        table: function table(header, body) {
            return '<table class="table table-condensed table-bordered">' + header + body + '</table>';
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
'use strict';

angular.module('components', ['components.blog', 'components.register', 'components.login', 'components.error-page', 'components.inventory', 'components.about-page' + '']);})(window.angular);
(function(angular){
'use strict';
'use strict';

angular.module('components.about-page', ['ui.router']);})(window.angular);
(function(angular){
'use strict';
'use strict';

angular.module('components.blog', ['ui.router']);})(window.angular);
(function(angular){
'use strict';
'use strict';

angular.module('components.error-page', ['ui.router']);})(window.angular);
(function(angular){
'use strict';
'use strict';

angular.module('components.inventory', ['ui.router']);})(window.angular);
(function(angular){
'use strict';
'use strict';

angular.module('components.login', ['ui.router']);})(window.angular);
(function(angular){
'use strict';
'use strict';

angular.module('components.register', ['ui.router']);})(window.angular);
(function(angular){
'use strict';
'use strict';

function AuthorizeService($rootScope, SessionService, $state, $timeout, $q) {
    return {
        authorize: function authorize() {
            return SessionService.getSession(true).then(function () {
                if (SessionService.isAuthenticated() && SessionService.isAdmin()) return $q.when();
                return $q.reject('403 Access Denied');
            });
        },
        authenticate: function authenticate() {
            return SessionService.getSession();
        }
    };
}

AuthorizeService.$inject = ['$rootScope', 'SessionService', '$state', '$timeout', '$q'];

angular.module('common').factory('AuthorizeService', AuthorizeService);})(window.angular);
(function(angular){
'use strict';
'use strict';

var root = {
    templateUrl: './root.html'

};

angular.module('root').component('root', root);})(window.angular);
(function(angular){
'use strict';
'use strict';

function SessionService($http, $rootScope, $q) {
    var _session = undefined;
    var _authenticated = false;
    var ADMIN_ROLE = 2;
    var USER_ROLE = 1;

    function updateSession(newSession) {
        _session = newSession;
        _authenticated = !!newSession;
        $rootScope.session = _session;
        return _session;
    }

    var _service = {
        getSession: function getSession(force) {
            console.log('begin getting session');
            var deferredSession = $q.defer();

            if (force === true) updateSession(undefined);

            deferredSession.resolve(!angular.isDefined(_session) ? $http.get('/api/session') : {
                data: {
                    success: !!_session,
                    session: _session
                }
            });

            return deferredSession.promise.then(function (res) {
                return $q(function (resolve, reject) {
                    updateSession(res.data.session || null);
                    if (res.data.success) {
                        resolve(_session);
                    } else reject({ status: 204, message: 'User not authenticated' });
                });
            });
        },
        getAuthorize: function getAuthorize() {
            return _service.getSession().then(function () {
                if (_service.isAuthenticated() && _service.isAdmin()) return $q.when({
                    success: true,
                    session: _session
                });else return $q.reject({
                    status: 403,
                    message: 'User not authorized'
                });
            });
        },
        isResolved: function isResolved() {
            return angular.isDefined(_session);
        },
        isAuthenticated: function isAuthenticated() {
            return _authenticated;
        },
        isAdmin: function isAdmin() {
            console.log(_session);
            return _authenticated && _session.role.roleID === ADMIN_ROLE;
        },
        login: function login(loginObj) {
            return $http.post('/api/session/login', loginObj).then(function (res) {
                if (res.data.message && res.data.message.length > 0) toastr[res.data.success ? 'success' : 'error'](res.data.message);

                if (res.data.success) updateSession(res.data.user);

                return res;
            });
        },
        logout: function logout() {
            return $http.get('/api/session/logout').then(function (res) {
                toastr.success('You are now logged out!');
                updateSession(null);
                return res;
            });
        },
        signup: function signup(registerObj) {
            return $http.post('/api/session/signup', registerObj).then(function (res) {
                if (res.data.message && res.data.message.length > 0) toastr[res.data.success ? 'success' : 'error'](res.data.message);

                if (res.data.success) updateSession(res.data.user);

                return res;
            });
        },
        currentSession: function currentSession() {
            return _session;
        }
    };

    return _service;
}

SessionService.$inject = ['$http', '$rootScope', '$q'];

angular.module('common').factory('SessionService', SessionService);})(window.angular);
(function(angular){
'use strict';
'use strict';

var appNav = {
    templateUrl: './app-nav.html',
    controller: 'AppNavController',
    bindings: {
        session: '='
    }
};

angular.module('common').component('appNav', appNav);})(window.angular);
(function(angular){
'use strict';
'use strict';

var AppNavController = function AppNavController($http, sessionService, $state) {
    var ctrl = this;
    ctrl.login = {
        username: null,
        password: null,
        remember: false
    };
    ctrl.submit = function () {
        sessionService.login(ctrl.login).then(function (res) {
            if (res.data.success) ctrl.session = res;else if (!res.data.success) {
                console.log('blarg');
                $state.go('app.login', {
                    password: ctrl.login.password,
                    username: ctrl.login.username,
                    errors: res.data.errors
                });
            }
        });
    };
    ctrl.logout = function () {
        sessionService.logout().then(function () {
            ctrl.session = null;
            $state.go('app.blog');
        });
    };
};

AppNavController.$inject = ['$http', 'SessionService', '$state'];

angular.module('common').controller('AppNavController', AppNavController);})(window.angular);
(function(angular){
'use strict';
'use strict';

var app = {
    templateUrl: './app.html',
    controller: 'AppController',
    bindings: {
        session: '<'
    }
};

angular.module('common').component('app', app).config(["$stateProvider", "$urlRouterProvider", "$transitionsProvider", function ($stateProvider, $urlRouterProvider, $transitionsProvider) {
    $stateProvider.state('app', {
        abstract: true,
        redirectTo: 'inventory',
        data: {
            requiredAuth: true
        },
        component: 'app',
        resolve: {
            session: ["SessionService", function session(SessionService) {
                console.log("start session resolve");
                return SessionService.getSession().catch(function (err) {
                    console.log(err);
                });
            }]
        }
    }).state('app.logged-in', {
        url: '/logged-in',
        template: '<div class="col-md-12 text-center"><h2>You are logged in as: <strong>{{$root.session.username}}</strong></h2></div>'
    });

    $urlRouterProvider.otherwise(function ($injector, $location) {
        var state = $injector.get('$state');
        if ($location.path() === ' ' || $location.path() === '') {
            state.go('app.inventory');
        } else state.go('app.error-page', { error: 404 });
        return $location.path();
    });

    //send error msg to error page
    $transitionsProvider.onError({}, function ($transition$) {
        $transition$.promise.catch(function (err) {
            if (err.hasOwnProperty('status') && err.status == 404) return $transition$.router.stateService.go('app.error-page', {
                error: 404,
                message: err.message
            });

            return null;
        });
    });

    $transitionsProvider.onBefore({ to: function to(state) {
            return state.requiresAdmin;
        } }, function ($transition$) {
        console.log(angular.copy($transition$.router.stateService));
        return $transition$.injector().get('SessionService').getAuthorize().catch(function (err) {
            $transition$.router.stateService.go('app.error-page', {
                error: 403,
                message: 'You do not have the proper permissions to access this page.'
            });
        });
    });

    $transitionsProvider.onBefore({ to: function to(state) {
            return state.redirectIfAuth;
        } }, function ($transition$) {
        return $transition$.injector().get('SessionService').getSession().then(function (res) {
            console.log(res);
            return $transition$.router.stateService.go('app.logged-in');
        }).catch(function (err) {
            return null;
        });
    });
}]).run(["$state", function ($state) {
    $state.defaultErrorHandler(function () {
        // Do not log transitionTo errors
    });
}]);})(window.angular);
(function(angular){
'use strict';
'use strict';

AppController.$inject = ["$state", "$rootScope"];
function AppController($state, $rootScope) {
    var ctrl = this;
}

angular.module('common').controller('AppController', AppController);})(window.angular);
(function(angular){
'use strict';
'use strict';

angular.module('monospaced.elastic', []).constant('msdElasticConfig', {
    append: ''
}).directive('msdElastic', ['$timeout', '$window', 'msdElasticConfig', function ($timeout, $window, config) {
    'use strict';

    return {
        require: 'ngModel',
        restrict: 'A, C',
        link: function link(scope, element, attrs, ngModel) {

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
                mirrorInitStyle = 'position: absolute; top: -999px; right: auto; bottom: auto;' + 'left: 0; overflow: hidden; -webkit-box-sizing: content-box;' + '-moz-box-sizing: content-box; box-sizing: content-box;' + 'min-height: 0 !important; height: 0 !important; padding: 0;' + 'word-wrap: break-word; border: 0;',
                $mirror = angular.element('<textarea aria-hidden="true" tabindex="-1" ' + 'style="' + mirrorInitStyle + '"/>').data('elastic', true),
                mirror = $mirror[0],
                taStyle = getComputedStyle(ta),
                resize = taStyle.getPropertyValue('resize'),
                borderBox = taStyle.getPropertyValue('box-sizing') === 'border-box' || taStyle.getPropertyValue('-moz-box-sizing') === 'border-box' || taStyle.getPropertyValue('-webkit-box-sizing') === 'border-box',
                boxOuter = !borderBox ? { width: 0, height: 0 } : {
                width: parseInt(taStyle.getPropertyValue('border-right-width'), 10) + parseInt(taStyle.getPropertyValue('padding-right'), 10) + parseInt(taStyle.getPropertyValue('padding-left'), 10) + parseInt(taStyle.getPropertyValue('border-left-width'), 10),
                height: parseInt(taStyle.getPropertyValue('border-top-width'), 10) + parseInt(taStyle.getPropertyValue('padding-top'), 10) + parseInt(taStyle.getPropertyValue('padding-bottom'), 10) + parseInt(taStyle.getPropertyValue('border-bottom-width'), 10)
            },
                minHeightValue = parseInt(taStyle.getPropertyValue('min-height'), 10),
                heightValue = parseInt(taStyle.getPropertyValue('height'), 10),
                minHeight = Math.max(minHeightValue, heightValue) - boxOuter.height,
                maxHeight = parseInt(taStyle.getPropertyValue('max-height'), 10),
                mirrored,
                active,
                copyStyle = ['font-family', 'font-size', 'font-weight', 'font-style', 'letter-spacing', 'line-height', 'text-transform', 'word-spacing', 'text-indent'];

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
                'resize': resize === 'none' || resize === 'vertical' ? 'none' : 'horizontal'
            }).data('elastic', true);

            /*
             * methods
             */

            function initMirror() {
                var mirrorStyle = mirrorInitStyle;

                mirrored = ta;
                // copy the essential styles from the textarea to the mirror
                taStyle = getComputedStyle(ta);
                angular.forEach(copyStyle, function (val) {
                    mirrorStyle += val + ':' + taStyle.getPropertyValue(val) + ';';
                });
                mirror.setAttribute('style', mirrorStyle);
            }

            function adjust() {
                var taHeight, taComputedStyleWidth, mirrorHeight, width, overflow;

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
                    $timeout(function () {
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

            scope.$watch(function () {
                return ngModel.$modelValue;
            }, function (newValue) {
                forceAdjust();
            });

            scope.$on('elastic:adjust', function () {
                initMirror();
                forceAdjust();
            });

            $timeout(adjust, 0, false);

            /*
             * destroy
             */

            scope.$on('$destroy', function () {
                $mirror.remove();
                $win.unbind('resize', forceAdjust);
            });
        }
    };
}]);})(window.angular);
(function(angular){
'use strict';
"use strict";

var compareTo = function compareTo() {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function link(scope, element, attributes, ngModel) {

            ngModel.$validators.compareTo = function (modelValue) {
                return modelValue == scope.otherModelValue;
            };

            scope.$watch("otherModelValue", function () {
                ngModel.$validate();
            });
        }
    };
};

angular.module('directives', []).directive("compareTo", compareTo);})(window.angular);
(function(angular){
'use strict';
'use strict';

function serverValidate() {
    return {
        restrict: 'A',
        require: 'form',
        link: function link($scope, $elem, $attrs, form) {
            var invalidateField = function invalidateField(field, errorType) {
                var changeListener = function changeListener() {
                    field.$setValidity(errorType, true);

                    var index = field.$viewChangeListeners.indexOf(changeListener);
                    if (index > -1) {
                        field.$viewChangeListeners.splice(index, 1);
                    }
                };

                field.$setDirty();
                field.$setValidity(errorType, false);
                field.$viewChangeListeners.push(changeListener);
            };

            $scope.$watch('serverErrors', function (errors) {
                if (errors) {
                    angular.forEach(errors, function (error) {
                        if (!angular.isArray(error.field)) error.field = [error.field];

                        angular.forEach(error.field, function (field) {
                            if (field in form) invalidateField(form[field], 'server.' + error.type);
                        });
                    });
                }
            });
        }
    };
}

angular.module('common').directive('serverValidate', serverValidate);})(window.angular);
(function(angular){
'use strict';
'use strict';

var errorBox = {
    templateUrl: './error-box.html',
    controller: 'ErrorBoxController',
    bindings: {
        errors: '<'
    }
};

angular.module('common').component('errorBox', errorBox);})(window.angular);
(function(angular){
'use strict';
'use strict';

function ErrorBoxController($scope) {
    var ctrl = this;
    console.log(ctrl);
    console.log($scope);
}

ErrorBoxController.$inject = ['$scope'];

angular.module('common').controller('ErrorBoxController', ErrorBoxController);})(window.angular);
(function(angular){
'use strict';
'use strict';

var aboutPage = {
    templateUrl: './about-page.html',
    controller: 'AboutPageController',
    bindings: {}
};

angular.module('components.about-page').component('aboutPage', aboutPage).config(["$stateProvider", function ($stateProvider) {
    $stateProvider.state('app.about', {
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
}]);})(window.angular);
(function(angular){
'use strict';
'use strict';

function AboutPageController() {}

AboutPageController.$inject = [];

angular.module('components.about-page').controller('AboutPageController', AboutPageController);})(window.angular);
(function(angular){
'use strict';
'use strict';

function BlogService($resource, $q) {
    var Article = $resource('/api/article/:id', { articleID: '@id' });
    var Comments = $resource('/api/comments');
    return {
        getArticles: function getArticles() {
            return Article.get().$promise.then(function (result) {
                if (result.success) return result.results;

                return [];
            });
        },
        getArticleById: function getArticleById(key) {
            return Article.get({ id: key }).$promise.then(function (result) {
                //if(result.success) return result.results;
                //console.log('rejected');
                //throw new Error('Article doesn\'t exist!');

                return $q(function (resolve, reject) {
                    if (result.success) resolve(result.results);else reject({ status: 404, message: 'Article not found!' });
                });
            });
        },
        getCommentsByArticle: function getCommentsByArticle(obj) {
            if (!obj.parentID) obj.parentID = null;

            return Comments.get(obj).$promise.then(function (result) {

                if (result.success) return result.results;

                return [];
            });
        },
        postCommentForArticle: function postCommentForArticle(data) {

            return Comments.save(data).$promise.then(function (result) {
                if (result.success) return result.results;

                return [];
            });
        },
        postArticle: function postArticle(data) {
            return Article.save(data).$promise.then(function (result) {
                return result;
            });
        }
    };
}

BlogService.$inject = ['$resource', '$q'];

angular.module('components.blog').factory('BlogService', BlogService);})(window.angular);
(function(angular){
'use strict';
'use strict';

var errorPage = {
    templateUrl: './error-page.html',
    controller: 'ErrorPageController',
    bindings: {
        previousState: '<'
    }
};

angular.module('components.error-page').component('errorPage', errorPage).config(["$stateProvider", function ($stateProvider) {
    $stateProvider.state('app.error-page', {
        url: '/error-page?error',
        component: 'errorPage',
        views: {
            '': {
                component: 'errorPage'
            }
        },
        params: {
            error: '404',
            message: 'You took a wrong turn!',
            previousState: null
        },
        resolve: {
            previousState: ["$state", function ($state) {
                console.log($state.params);
                return {
                    name: $state.current.name,
                    params: angular.copy($state.params),
                    URL: $state.href($state.current.name, $state.params)
                };
            }]
        },
        data: {
            displayName: 'errorPage'
        }
    });
}]);})(window.angular);
(function(angular){
'use strict';
'use strict';

function ErrorPageController($state, $stateParams, ErrorPageService) {
    var ctrl = this;
    console.log('ERROR PAGE@!');
    console.log(ctrl);
    console.log($stateParams);
    var errors = {
        404: 'Not Found',
        403: 'Access Denied'
    };
    ctrl.errorCode = $stateParams.error || 404;
    ctrl.errorDesc = errors[$stateParams.error || 404];
    ctrl.errorMsg = $stateParams.message;
    ctrl.back = function () {
        $state.go(ctrl.previousState.name || 'app.blog', ctrl.previousState.params || {});
    };
    ctrl.$onInit = function () {
        if ($stateParams.error == 403) ErrorPageService.afterLoginRedirect = ctrl.previousState;
    };
}

ErrorPageController.$inject = ['$state', '$stateParams', 'ErrorPageService'];

angular.module('components.error-page').controller('ErrorPageController', ErrorPageController);})(window.angular);
(function(angular){
'use strict';
'use strict';

function ErrorPageService() {
    return {
        afterLoginRedirect: null
    };
}

ErrorPageService.$inject = [];

angular.module('components.error-page').factory('ErrorPageService', ErrorPageService);})(window.angular);
(function(angular){
'use strict';
'use strict';

var inventory = {
    templateUrl: './inventory.html',
    controller: 'InventoryController',
    bindings: {
        items: '<'
    }
};

angular.module('components.inventory').component('inventory', inventory).config(["$stateProvider", function ($stateProvider) {
    $stateProvider.state('app.inventory', {
        url: '/inventory?sort&page&limit&search',
        component: 'inventory',
        resolve: {
            items: ["ItemService", "$stateParams", function items(ItemService, $stateParams) {
                return ItemService.getItems($stateParams);
            }]
        },
        views: {
            '': {
                component: 'inventory'
            },
            widget: {
                template: '\n                            \n                        '
            }
        }
    });
}]);})(window.angular);
(function(angular){
'use strict';
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var InventoryController = function () {
    InventoryController.$inject = ["ItemService", "InventoryService", "$stateParams"];
    function InventoryController(ItemService, InventoryService, $stateParams) {
        _classCallCheck(this, InventoryController);

        this.items = []; //populated by resolve on route
        this.ItemService = ItemService;
        this.InventoryService = InventoryService;
        this.$stateParams = $stateParams;
        this.filter = {};
        this.itemHistory = {};
        this.loading = true;
    }

    _createClass(InventoryController, [{
        key: "getItem",
        value: function getItem(id) {
            return this.InventoryService.getItem(id);
        }
    }, {
        key: "$onInit",
        value: function $onInit() {
            this.InventoryService.init(this.items);
            this.InventoryService.load();
            this.loading = false;
        }
    }, {
        key: "handleFilterChange",
        value: function handleFilterChange() {
            var _this = this;

            this.$stateParams.search = JSON.stringify(this.filter);
            this.ItemService.getItems(this.$stateParams).then(function (result) {
                _this.items = result;
            });
        }
    }, {
        key: "incrementQuantity",
        value: function incrementQuantity(item) {
            item.quantity++;

            var elem = $('#item-slider-' + item._original.item_id);
            if (elem.hasClass('slide-right')) return;
            elem.addClass('slide-right');
            setTimeout(function () {
                elem.removeClass('slide-right');
            }, 300);
        }
    }, {
        key: "decrementQuantity",
        value: function decrementQuantity(item) {
            item.quantity--;

            var elem = $('#item-slider-' + item._original.item_id);
            if (elem.hasClass('slide-left')) return;
            elem.addClass('slide-left');
            setTimeout(function () {
                elem.removeClass('slide-left');
            }, 300);
        }
    }, {
        key: "handleCommit",
        value: function handleCommit() {
            var _this2 = this;

            this.loading = true;
            return this.InventoryService.commit().then(function (result) {
                return _this2.ItemService.getItems();
            }).then(function (result) {
                _this2.items = result;
                _this2.$onInit();
                _this2.loading = false;
            });
        }
    }, {
        key: "$inject",
        get: function get() {
            return ["ItemService", "InventoryService", '$stateParams'];
        }
    }, {
        key: "currentItems",
        get: function get() {
            return this.items;
        }
    }]);

    return InventoryController;
}();

angular.module('components.inventory').controller('InventoryController', InventoryController);})(window.angular);
(function(angular){
'use strict';
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var InventoryItem = function () {
    function InventoryItem(session, obj) {
        _classCallCheck(this, InventoryItem);

        if (!session) return {};
        if (!obj) return {};

        this._session = session;
        this._original = obj;
        this._dirty = false;
        this._dirtyCount = 0;
        this._changes = {};

        /* const self = Object.create(obj);
         self.freeze();
         Object.assign(this, self);*/
        /*this.name = obj.name;
         this.quantity = obj.quantity;
         this.category = obj.category;
         this.item_id = obj.item_id;
         this.description = obj.description;
         this.unit = obj.unit;*/
    }

    _createClass(InventoryItem, [{
        key: 'loadFromHistory',
        value: function loadFromHistory(history) {
            this._changes = history;
        }
    }, {
        key: 'isDirty',
        value: function isDirty() {
            return Object.keys(this._changes).length > 0;
        }
    }, {
        key: 'toJSON',
        value: function toJSON() {
            return this._changes || null;
        }

        /*mod(num) {
         if(num === 0) return;
           this.change += num;
           if(this.change + this.quantity < 0) this.change -= (this.change + this.quantity);
           if(this.change !== 0) this.dirty = true;
         }*/

    }, {
        key: 'name',
        get: function get() {
            return this._changes['name'] || this._original['name'];
        },
        set: function set(newName) {
            if (newName === this._original['name']) delete this._changes['name'];else this._changes['name'] = newName;
        }
    }, {
        key: 'quantity',
        get: function get() {
            return this._original['quantity'] || 0; //this._original['quantity'];
        },
        set: function set(num) {
            var mod = num - this._original['quantity'];

            if (mod === 0) return;

            if (!this._changes['quantity']) this._changes['quantity'] = 0;

            this._changes['quantity'] += mod;

            if (this._changes['quantity'] + this._original['quantity'] < 0) this._changes['quantity'] -= this._changes['quantity'] + this._original['quantity'];

            if (this._changes['quantity'] === 0) delete this._changes['quantity'];

            this._session.save();
        }
    }]);

    return InventoryItem;
}();

var InventoryService = function () {
    function InventoryService(ItemService) {
        _classCallCheck(this, InventoryService);

        this.allItems = {};
        this.lastSavedHistory = {};
        this.currentHistory = {};
        this.inProgress = false;
        this.ItemService = ItemService;
    }

    _createClass(InventoryService, [{
        key: 'init',
        value: function init(rawItems) {
            var _this = this;

            this.allItems = {};
            rawItems.forEach(function (item) {
                _this.allItems[item.item_id] = new InventoryItem(_this, item);
            });
        }
    }, {
        key: 'getItem',
        value: function getItem(id) {
            return this.allItems[id];
        }
    }, {
        key: 'save',
        value: function save() {
            this.lastSavedHistory = this.currentHistory;
            localStorage.setItem('_invSession', JSON.stringify(this.allItems));
            this.currentHistory = JSON.parse(localStorage.getItem('_invSession'));
            console.log(this.lastSavedHistory);
        }
    }, {
        key: 'start',
        value: function start() {
            if (this.inProgress) return;

            this.inProgress = true;
        }
    }, {
        key: 'load',
        value: function load() {
            if (!localStorage.getItem('_invSession')) this.save();else {
                var savedHistory = JSON.parse(localStorage.getItem('_invSession'));
                for (var key in savedHistory) {

                    if (!this.allItems[key]) continue;
                    this.allItems[key].loadFromHistory(savedHistory[key]);
                }
            }

            this.start();
        }
    }, {
        key: 'reset',
        value: function reset() {
            this.inProgress = false;
            localStorage.setItem('_invSession', null);
            localStorage.clear();
            this.allItems = {};
            this.currentHistory = {};
        }
    }, {
        key: 'commit',
        value: function commit() {
            var _this2 = this;

            this.save();
            return this.ItemService.commit(this.currentHistory).then(function (result) {
                _this2.reset();
                return result;
            });
        }
    }, {
        key: '$inject',
        get: function get() {
            return ['ItemService'];
        }
    }]);

    return InventoryService;
}();

angular.module('components.inventory').factory('InventoryService', ["ItemService", function (ItemService) {
    return new InventoryService(ItemService);
}]);})(window.angular);
(function(angular){
'use strict';
'use strict';

function ItemService($resource) {
    var Item = $resource('/api/item/', null, {
        'update': { method: 'PUT' }
    });
    return {
        getItems: function getItems(params) {
            return Item.get(params || {}).$promise.then(function (result) {
                console.log(result);
                if (result.success) return result.results;

                return [];
            });
        },
        commit: function commit(items) {
            return Item.save(items).$promise;
        },
        Item$: Item
    };
}

ItemService.$inject = ['$resource'];

angular.module('components.inventory').factory('ItemService', ItemService);})(window.angular);
(function(angular){
'use strict';
'use strict';

var login = {
    templateUrl: './login.html',
    controller: 'LoginController',
    bindings: {
        errors: '<',
        previousState: '<'
    }
};

angular.module('components.login').component('login', login).config(["$stateProvider", function ($stateProvider) {
    $stateProvider.state('app.login', {
        url: '/login?username',
        component: 'login',
        params: {
            errors: null,
            password: null
        },
        redirectIfAuth: true,
        resolve: {
            'errors': ["$stateParams", function errors($stateParams) {
                return $stateParams.errors;
            }],
            previousState: ["$state", function ($state) {
                return {
                    name: $state.current.name,
                    params: angular.copy($state.params),
                    URL: $state.href($state.current.name, $state.params)
                };
            }]
        },
        views: {
            '': {
                component: 'login'
            } /*,
              widget: {
                 template: 'asdf'
              },
              'errors@app.login': {
                 component: 'errorBox'
              }*/
        },
        data: {
            displayName: 'login'
        }
    });
}]);})(window.angular);
(function(angular){
'use strict';
'use strict';

function LoginController(SessionService, $state, $stateParams, $scope, ErrorPageService) {
    var ctrl = this;
    ctrl.fields = ['username', 'password'];
    ctrl.loginData = {
        username: $stateParams.username || '',
        password: $stateParams.password || ''
    };
    ctrl.login = function () {
        if (!ctrl.loginData.username) return toastr.error('missing username');
        if (!ctrl.loginData.password) return toastr.error('missing password');

        SessionService.login(ctrl.loginData).then(function (res) {
            if (res.data.success) {
                toastr.success('Login was successful!');
                if (ErrorPageService.afterLoginRedirect) {
                    ctrl.previousState = ErrorPageService.afterLoginRedirect;
                    console.log(ctrl.previousState);
                }
                $state.go(ctrl.previousState.name, ctrl.previousState.params, { reload: true });
            }

            if (res.data.errors) {
                $scope.serverErrors = ctrl.errors = res.data.errors;
            }
        });
    };

    ctrl.reload = function () {
        $state.go('.', { errors: ['you done fucked up'] });
    };

    ctrl.$onInit = function () {
        if (ctrl.errors) $scope.serverErrors = ctrl.errors;
    };
}

LoginController.$inject = ['SessionService', '$state', '$stateParams', '$scope', 'ErrorPageService'];

angular.module('components.login').controller('LoginController', LoginController);})(window.angular);
(function(angular){
'use strict';
'use strict';

var register = {
    templateUrl: './register.html',
    controller: 'RegisterController'
};

angular.module('components.register').component('register', register).config(["$stateProvider", function ($stateProvider) {
    $stateProvider.state('app.register', {
        url: '/register',
        component: 'register',
        redirectIfAuth: true,
        views: {
            '': {
                component: 'register'
            }
        },
        data: {
            displayName: 'register'
        }
    });
}]);})(window.angular);
(function(angular){
'use strict';
'use strict';

function RegisterController(SessionService, $state, $scope) {
    var ctrl = this;
    ctrl.fields = ['username', 'password', 'confirmPassword'];
    ctrl.registerData = {};
    ctrl.register = function () {
        if (!ctrl.registerData.username) return toastr.error('missing username');
        if (!ctrl.registerData.password) return toastr.error('missing password');
        if (!ctrl.registerData.confirmPassword) return toastr.error('missing confirmPassword');

        SessionService.signup(ctrl.registerData).then(function (res) {
            if (res.data.success) {
                toastr.success('Registration was successful!');
                $state.go('app.blog');
            }

            if (res.data.errors) {
                $scope.serverErrors = ctrl.errors = res.data.errors;
            }
        });
    };
}

RegisterController.$inject = ['SessionService', '$state', '$scope'];

angular.module('components.register').controller('RegisterController', RegisterController);})(window.angular);
(function(angular){
'use strict';
'use strict';

var article = {
    bindings: {
        'article': '<'
    },
    templateUrl: './article.html',
    controller: 'ArticleController'
};

angular.module('components.blog').component('article', article);})(window.angular);
(function(angular){
'use strict';
'use strict';

function ArticleController($state, ArticleService) {
    var ctrl = this;
    //console.log(ctrl);

    ctrl.$onInit = function () {
        //console.log("WE DID THE THINGF");
    };

    ctrl.deleteArticle = function () {
        ArticleService.deleteArticle({ articleID: ctrl.article.articleID }).then(function (res) {
            $state.go('app.blog', {}, { reload: true });
        });
    };
}

ArticleController.$inject = ['$state', 'ArticleService'];

angular.module('components.blog').controller('ArticleController', ArticleController);})(window.angular);
(function(angular){
'use strict';
'use strict';

function ArticleService($resource) {
    var Article = $resource('/api/article/:articleID', null, {
        'update': { method: 'PUT' }
    });
    return {
        getArticles: function getArticles() {
            return Article.get().$promise.then(function (result) {
                if (result.success) return result.results;

                return [];
            });
        },
        getArticleById: function getArticleById(key) {
            return Article.get({ articleID: key }).$promise.then(function (result) {
                if (result.success) return result.results;

                console.log(result);

                return [];
            });
        },
        postArticle: function postArticle(data) {
            return Article.save(data).$promise;
        },
        updateArticle: function updateArticle(id, data) {
            return Article.update(id, data).$promise;
        },
        deleteArticle: function deleteArticle(data) {
            return Article.remove(data).$promise;
        }
    };
}

ArticleService.$inject = ['$resource'];

angular.module('components.blog').factory('ArticleService', ArticleService);})(window.angular);
(function(angular){
'use strict';
'use strict';

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

angular.module('components.blog').component('articleCommentsChildren', articleCommentsChildren);})(window.angular);
(function(angular){
'use strict';
'use strict';

function ArticleCommentsChildrenController(BlogService, SessionService, $location, $anchorScroll, $scope) {
    var ctrl = this;
    ctrl.hidden = ctrl.parentId != 'root';
    ctrl.onPost = function () {
        $scope.$emit('postComment', 'asdf');
    };
}

ArticleCommentsChildrenController.$inject = ['BlogService', 'SessionService', '$location', '$anchorScroll', '$scope'];

angular.module('components.blog').controller('ArticleCommentsChildrenController', ArticleCommentsChildrenController);})(window.angular);
(function(angular){
'use strict';
'use strict';

var articleComments = {
    templateUrl: './article-comments.html',
    controller: 'ArticleCommentsController',
    bindings: {
        article: '<',
        comments: '<'
    }
};

angular.module('components.blog').component('articleComments', articleComments);})(window.angular);
(function(angular){
'use strict';
'use strict';

function ArticleCommentsController(BlogService, SessionService, marked, $scope, $location, $anchorScroll) {
    var ctrl = this;

    ctrl.$onInit = function () {
        $scope.$on('updateComments', function (event, data) {
            event.stopPropagation();
            /*ctrl.comments.unshift(data.comment);*/
        });

        ctrl.sortComments();
    };

    ctrl.postComment = function () {
        SessionService.getSession().then(function (session) {
            return BlogService.postCommentForArticle({
                articleID: ctrl.article.articleID,
                body: ctrl.pendingComment,
                userID: session.userID
            }).then(function (results) {
                ctrl.pendingComment = '';
                ctrl.comments.unshift(results);

                $location.hash('article-' + results.articleID + '-comment-' + results.commentID);
                $anchorScroll();
            });
        }).catch(function (err) {
            toastr.error(err.message);
        });
    };

    ctrl.sortComments = function () {
        function getChildComments(parentComment, callback) {
            // Mock asynchronous implementation, for testing the rest of the code
            var children = ctrl.comments.filter(function (comment) {

                return comment.parentID == parentComment.commentID;
            });

            callback(null, children);
        }

        var container = {}; // dummy node to collect complete hierarchy into
        getBlock([container], function rootCallback() {
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
    };
}

ArticleCommentsController.$inject = ['BlogService', 'SessionService', 'marked', '$scope', '$location', '$anchorScroll'];

angular.module('components.blog').run(['$anchorScroll', function ($anchorScroll) {
    $anchorScroll.yOffset = 150; // always scroll by 50 extra pixels
}]).controller('ArticleCommentsController', ArticleCommentsController);})(window.angular);
(function(angular){
'use strict';
'use strict';

var articlePage = {
    templateUrl: './article-create.html',
    controller: 'ArticleCreateController',
    bindings: {
        article: '<'
    }
};

angular.module('components.blog').component('articleCreate', articlePage).config(["$stateProvider", function ($stateProvider) {
    $stateProvider.state('app.article.create', {
        url: '/create',
        component: 'articleCreate',
        /*resolve: {
            article: function ($transition$, BlogService) {
                var key = $transition$.params().articleID;
                return BlogService.getArticleById(key);
            }
        }*/
        requiresAdmin: true,
        views: {
            '@app': {
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
'use strict';

function ArticleCreateController(ArticleService, SessionService, marked, $state) {
    var ctrl = this;

    ctrl.articleBody = '';
    ctrl.articleTitle = '';
    ctrl.rightNow = new Date();
    ctrl.currentUser = SessionService.currentSession().username;

    ctrl.$onInit = function $onInit() {
        if (ctrl.article) {
            ctrl.articleBody = ctrl.article.body;
            ctrl.articleTitle = ctrl.article.title;
        }
    };

    ctrl.postArticle = function () {
        if (!SessionService.isAuthenticated()) return toastr.warning('You need to be logged in.');

        var body = {
            title: ctrl.articleTitle || null,
            body: ctrl.articleBody || null,
            userID: SessionService.currentSession().userID || null
        };

        (ctrl.article ? ArticleService.updateArticle({ articleID: ctrl.article.articleID }, body) : ArticleService.postArticle(body)).then(function (res) {
            if (res.success) {
                toastr.success('Article posted successfully!');
                return $state.go('app.article.view', { articleID: res.results.articleID }, { reload: true });
            }

            toastr.error(res.message || 'Something went wrong!');
            return null;
        });
    };
}

ArticleCreateController.$inject = ['ArticleService', 'SessionService', 'marked', '$state'];

angular.module('components.blog').controller('ArticleCreateController', ArticleCreateController);})(window.angular);
(function(angular){
'use strict';
'use strict';

var articlePage = {
    bindings: {
        'article': '<',
        'comments': '<'
    },
    templateUrl: './article-page.html',
    controller: 'ArticlePageController'
};

angular.module('components.blog').component('articlePage', articlePage).config(["$stateProvider", "$urlRouterProvider", "$transitionsProvider", function ($stateProvider, $urlRouterProvider, $transitionsProvider) {
    $stateProvider.state('app.article', {
        abstract: true,
        url: '/article',
        data: {
            breadcrumbProxy: 'app.blog'
        }
    }).state('app.article.view', {
        url: '/{articleID:[0-9]+}',
        component: 'articlePage',
        resolve: {
            article: ["$transition$", "BlogService", function article($transition$, BlogService) {
                console.log("asdf!!!");
                var key = $transition$.params().articleID;
                return BlogService.getArticleById(key);
            }],
            comments: ["$transition$", "BlogService", function comments($transition$, BlogService) {
                var key = $transition$.params().articleID;
                return BlogService.getCommentsByArticle({
                    articleID: key
                });
            }]
        },
        views: {
            '@app': {
                component: 'articlePage'
            }
        },
        data: {
            displayName: '{{article.articleID}}'
        }
    }).state('app.article.view.edit', {
        url: '/edit',
        component: 'articleCreate',
        resolve: {
            article: ["$transition$", "BlogService", function article($transition$, BlogService) {
                var key = $transition$.params().articleID;
                return BlogService.getArticleById(key);
            }]
        },
        requiresAdmin: true,
        views: {
            '@app': {
                component: 'articleCreate'
            } /*,
              'widget@app': {
                 template: '<ui-breadcrumbs displayname-property="data.displayName" ' +
                 'template-url="./uiBreadcrumbs.tpl.html" abstract-proxy-property="data.breadcrumbProxy"></ui-breadcrumbs>'
              }*/
        },
        data: {
            displayName: 'article edit'
        }
    });
}]);})(window.angular);
(function(angular){
'use strict';
'use strict';

function ArticlePageController(BlogService, SessionService, $location, $scope, $anchorScroll, $document, $timeout) {
    var ctrl = this;
    ctrl.pendingComment = '';

    ctrl.$onInit = function () {
        ctrl.sortComments();

        $scope.$on('postComment', function ($event, comment) {
            ctrl.postComment(comment);
        });
    };

    ctrl.postComment = function (comment) {
        console.log(comment.reference);

        if (!comment.articleID) return toastr.error('Missing an article!');
        if (!comment.body) return toastr.error('The body is empty!');

        var isRootComment = !comment.parentID;

        SessionService.getSession().then(function (session) {
            return BlogService.postCommentForArticle({
                articleID: comment.articleID,
                body: comment.body,
                userID: session.userID,
                parentID: isRootComment ? null : comment.parentID
            }).then(function (results) {

                if (isRootComment) ctrl.comments.unshift(results);else {
                    if (!comment.reference.replies) comment.reference.replies = [];
                    comment.reference.replies.push(results);
                    comment.reference.hidden = false;
                }

                $scope.$emit('updateComments', {
                    article: ctrl.article,
                    parent: ctrl.comment,
                    comment: results
                });

                //$location.hash('article-' + results.articleID + '-comment-' + results.commentID);
                //$anchorScroll();

                if (comment.successCallback) comment.successCallback();

                $timeout(function () {
                    var element = angular.element(document.getElementById('article-' + results.articleID + '-comment-' + results.commentID));
                    console.log(element);
                    $document.duScrollTo(element, 150, 1000);
                }, 0);
            });
        }).catch(function (err) {
            toastr.error(err.message);
        });
    };

    //TODO
    ctrl.sortComments = function () {
        function getChildComments(parentComment, callback) {
            // Mock asynchronous implementation, for testing the rest of the code
            var children = ctrl.comments.filter(function (comment) {

                return comment.parentID == parentComment.commentID;
            });

            callback(null, children);
        }

        var container = {}; // dummy node to collect complete hierarchy into
        getBlock([container], function rootCallback() {
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
    };
}

ArticlePageController.$inject = ['BlogService', 'SessionService', '$location', '$scope', '$anchorScroll', '$document', '$timeout'];

angular.module('components.blog').controller('ArticlePageController', ArticlePageController);})(window.angular);
(function(angular){
'use strict';
'use strict';

var blog = {
    bindings: {
        articles: '<'
    },
    templateUrl: './blog.html',
    controller: 'BlogController'
};

angular.module('components.blog').component('blog', blog).config(["$stateProvider", function ($stateProvider) {
    $stateProvider.state('app.blog', {
        url: '/',
        component: 'blog',
        resolve: {
            articles: ["BlogService", function articles(BlogService) {
                return BlogService.getArticles();
            }]
        },
        views: {
            '': {
                component: 'blog'
            }
        },
        data: {
            displayName: 'blog'
        }

    });
}]);})(window.angular);
(function(angular){
'use strict';
'use strict';

function blogController() {
    var ctrl = this;

    ctrl.$onInit = function () {
        ctrl.articles = ctrl.articles.reverse();
    };
}

angular.module('components.blog').controller('BlogController', blogController);})(window.angular);
(function(angular){
'use strict';
'use strict';

var replyBox = {
    bindings: {
        comment: '<',
        article: '<',
        hideFn: '&'
    },
    templateUrl: './reply-box.html',
    controller: function controller($scope, BlogService, SessionService) {
        var ctrl = this;
        ctrl.pendingComment = '';

        ctrl.$onDestroy = function () {
            console.log("DESTROY");
        };

        ctrl.postComment = function () {
            console.log(ctrl);
            $scope.$emit('postComment', {
                articleID: ctrl.article.articleID,
                body: ctrl.pendingComment,
                parentID: ctrl.comment ? ctrl.comment.commentID : null,
                reference: ctrl.comment,
                successCallback: function successCallback() {
                    ctrl.pendingComment = '';
                    ctrl.hideFn();
                }
            });
        };
    }
};

angular.module('components.blog').component('replyBox', replyBox);})(window.angular);
(function(angular){
'use strict';
'use strict';

function replyButton() {
    return {
        restrict: 'E',
        //template: '<a ng-click="$ctrl.addReplyBox()">reply</a>',
        templateUrl: './reply-button.html',
        controllerAs: '$ctrl',
        scope: {
            comment: '<',
            article: '<',
            onPost: '&'
        },

        controller: ["$scope", "$element", "$compile", function controller($scope, $element, $compile) {

            var ctrl = this;
            console.log(ctrl);
            var selector = '#commentid-' + ctrl.comment.commentID + '-reply-box';
            var replyBox = null;
            var replyBoxScope = null;

            ctrl.isActive = false;
            ctrl.addReplyBox = function addReplyBox() {
                if (ctrl.isActive || !$scope.$root.session) {
                    if (!$scope.$root.session) toastr.error('You must be logged in to do that.');
                    ctrl.hideReplyBox();
                    return;
                }

                ctrl.isActive = true;
                replyBoxScope = $scope.$new();
                replyBox = $compile('<reply-box comment="$ctrl.comment" article="$ctrl.article" hide-fn="$ctrl.hideReplyBox()"></reply-box>')(replyBoxScope);
                $(selector).append(replyBox);
            };

            ctrl.hideReplyBox = function () {
                if (!replyBox) return;
                $(replyBox).remove();
                replyBoxScope.$destroy();
                replyBoxScope = null;
                replyBox = null;
                ctrl.isActive = false;
            };
        }]
    };
}

angular.module('components.blog').directive('replyButton', replyButton);})(window.angular);
(function(angular){
'use strict';
'use strict';

angular.module('templates', []).run(['$templateCache', function ($templateCache) {
  $templateCache.put('./root.html', '<div class="root"><div ui-view></div></div>');
  $templateCache.put('./app-nav.html', '<nav class="navbar navbar-inverse navbar-fixed-top"><div class="container"><!-- Brand and toggle get grouped for better mobile display --><div class="navbar-header"><button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false"><span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span></button> <a class="navbar-brand" href="#"><span class="fa fa-database"></span></a></div><div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1"><ul class="nav navbar-nav"><li ui-sref-active="active"><a ui-sref=".blog">Blog</a></li><li ui-sref-active="active"><a ui-sref=".about">About</a></li></ul><ul class="nav navbar-nav navbar-right"><li ng-show="$root.session != null"><a class="text-primary">Logged in as: {{$root.session.username}}!</a><!--<ul class="dropdown-menu">\r\n                        <li>\r\n                            <a>haspm!!!</a>\r\n                        </li>\r\n                        <li>\r\n                            <a>haspm!!!</a>\r\n                        </li>\r\n                    </ul>--></li><li><a ng-click="$ctrl.logout()" ng-show="$root.session != null">Log out</a></li><li ui-sref-active="active"><a ui-sref=".register" ng-hide="$root.session != null">Sign Up</a></li><li class="dropdown" ng-hide="$root.session != null" ui-sref-active="active"><a ui-sref="app.login">Sign in <!--<b class="caret"></b>--></a><!--<ul class="dropdown-menu" style="padding: 15px;min-width: 250px;">\r\n                        <li>\r\n                            <div class="row">\r\n                                <div class="col-md-12">\r\n                                    <form class="form" role="form" accept-charset="UTF-8" id="login-nav">\r\n                                        <div class="form-group">\r\n                                            <label class="sr-only" for="exampleInputEmail2">Email address</label>\r\n                                            <input ng-model="$ctrl.login.username" type="text" class="form-control" id="exampleInputEmail2" placeholder="Email address" required="">\r\n                                        </div>\r\n                                        <div class="form-group">\r\n                                            <label class="sr-only" for="exampleInputPassword2">Password</label>\r\n                                            <input ng-model="$ctrl.login.password" type="password" class="form-control" id="exampleInputPassword2" placeholder="Password" required="">\r\n                                        </div>\r\n                                        <div class="checkbox">\r\n                                            <label>\r\n                                                <input type="checkbox"> Remember me\r\n                                            </label>\r\n                                        </div>\r\n                                        <div class="form-group">\r\n                                            <button type="submit" data-toggle="dropdown" class="btn btn-success btn-block" ng-click="$ctrl.submit()">Sign in</button>\r\n                                        </div>\r\n                                    </form>\r\n                                </div>\r\n                            </div>\r\n                        </li>\r\n                        <li class="divider"></li>\r\n                        <li>\r\n                            <a href="/api/session/facebook">facebook</a>\r\n                            <input class="btn btn-primary btn-block" type="button" id="sign-in-google" value="Sign In with Facebook" href="/api/session/facebook">\r\n                            <input class="btn btn-primary btn-block" type="button" id="sign-in-twitter" value="Sign In with Twitter">\r\n                        </li>\r\n                    </ul>--></li></ul></div></div><!-- /.container-fluid --></nav><!--<div class="splash-bg"></div>--><!--\r\n<div class="logo">\r\n    <img src="./img/logo.png" />\r\n</div>-->');
  $templateCache.put('./app.html', '<div class="root"><app-nav session="$ctrl.session"></app-nav><div ui-view="widget"></div><div class="app"><main class="container"><div class="blog-content"><div ui-view></div></div></main></div><!--<div class="row">\r\n        <div class="col-md-12 col-lg-6">\r\n            <label for="comment">Live Markdown with <a href="http://www.codingdrama.com/bootstrap-markdown/">Bootstrap-Markdown Editor</a>:</label>\r\n            <textarea name="content" markdown-editor="{\'iconlibrary\': \'fa\', addExtraButtons: true, resize: \'vertical\'}" rows="10" ng-model="markdown"></textarea>\r\n        </div>\r\n        <div class="col-md-12 col-lg-6 fill">\r\n            <div class="form-group">\r\n                <label for="comment">Preview Result:</label>\r\n                <div marked="markdown" class="outline" style="padding: 20px">\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>--></div>');
  $templateCache.put('./about-page.html', '..................?????');
  $templateCache.put('./inventory.html', '<div class="overlay" ng-show="$ctrl.loading">LOADING</div><div class=""><div class="inventory-toolbar"><div class="row-fluid top"><div class="pull-left"><button type="button" class="btn btn-default"><span class="fa fa-undo"></span></button> <button type="button" class="btn btn-default"><span class="fa fa-repeat"></span></button></div><div class="pull-right" ng-show="$ctrl.InventoryService.inProgress"><button type="button" class="btn btn-danger">Reset</button> <button type="button" class="btn btn-success" ng-click="$ctrl.handleCommit()">Commit</button></div><div class="clearfix"></div></div><!--<div>\r\n            <div class="btn-group btn-group-justified" role="group" aria-label="...">\r\n                <div class="btn btn-primary">Left</div>\r\n                <div class="btn btn-primary">Middle</div>\r\n                <div class="btn btn-primary">Right</div>\r\n            </div>\r\n        </div>--><div class="row-fluid middle"><ul class="nav nav-tabs"><li role="presentation" class="active"><a href="#" ng-click="showFilter = !showFilter">Filter</a></li><li role="presentation"><a href="#">...</a></li><li role="presentation"><a href="#">...</a></li></ul></div><div class="row-fluid bottom"><form class="form-inline" ng-show="showFilter"><div class="form-group"><label for="exampleInputName2" class="hidden-xs">Name</label><input placeholder="Name" type="text" class="form-control input-sm" ng-model="$ctrl.filter.name" ng-change="$ctrl.handleFilterChange()" ng-model-options="{ allowInvalid: true, debounce: 200 }"></div><div class="form-group"><label for="exampleInputName2" class="hidden-xs">Category</label><select class="form-control input-sm"><option>asdf</option><option>asdf</option><option>asdf</option></select></div><div class="form-group"><label for="exampleInputName2" class="hidden-xs">Quantity</label><input type="text" class="form-control input-sm" id="exampleInputName2" placeholder="Jane Doe"></div></form></div></div><div class="inventory-table-wrapper"><table class="table table-striped inventory-table"><tbody><tr class="bigger-text inventory-row" ng-repeat="item in $ctrl.currentItems" ng-init="$item = $ctrl.getItem(item.item_id)" ng-class="{\'inventory-row-dirty\' : $item.isDirty()}"><td>{{item.name}}&nbsp;&nbsp;<span class="hidden-xs">({{item.unit}})</span></td><td valign="center" ng-swipe-right="$ctrl.incrementQuantity($item)" ng-swipe-left="$ctrl.decrementQuantity($item)" style="padding:0" id="{{\'item-slider-\' + item.item_id}}" class="inv-slider"><span>{{$item._changes.quantity ? item.quantity : "&lt;[-]--[+]&gt;"}} <span ng-show="$item._changes.quantity" ng-class="$item._changes.quantity > 0 ? \'positive\' : \'negative\'" class="signed">{{$item._changes.quantity>0?$item._changes.quantity:($item._changes.quantity*-1) || \'\'}}</span></span></td><td class="inventory-total-col"><span ng-show="toggled"><input type="text" class="tiny-input" ng-model="tedt"> </span><span ng-show="!toggled" ng-click="toggled = true"><span ng-class="{\'positive\' : $item._changes.quantity > 0, \'negative\': $item._changes.quantity < 0}">{{($item._changes.quantity || 0) + item.quantity}}</span></span></td><td class="text-right hidden-xs"><span class="btn btn-default fa fa-minus" ng-click="$ctrl.decrementQuantity($item)"></span> <span class="btn btn-default fa fa-plus" ng-click="$ctrl.incrementQuantity($item)"></span></td></tr></tbody></table></div></div>');
  $templateCache.put('./error-page.html', '<div class="row"><div class="col-md-4"><span class="text-right bigger-text"><a ng-click="$ctrl.back()">\u21E6 Back</a></span><div class="well well-sm text-center"><img src="img/fuck-that-bitch-yao-ming.png" height="210" width="183"><div class="big-header">{{$ctrl.errorCode}}</div>{{$ctrl.errorDesc}}</div></div><div class="col-md-8"><span class="text-right">&nbsp;</span><div class="access-denied-block"><h1><span class="fa fa-warning"></span> {{$ctrl.errorMsg}}</h1><br><br><blockquote><p>We always long for the forbidden things, and desire what is denied us.</p></blockquote></div></div></div>');
  $templateCache.put('./login.html', '<div class="row"><form server-validate name="loginForm" ng-submit="$ctrl.login()"><div class="col-md-6 col-md-offset-3 stacked-inputs"><h1><span class="fa fa-sign-in" aria-hidden="true"></span> <span>Login</span></h1><div class="form-group no-margin" ng-class="{ \'has-error\': loginForm.username.$invalid && (loginForm.username.$dirty || loginForm.$submitted) }"><input class="form-control input-lg" placeholder="Username" name="username" required ng-model="$ctrl.loginData.username"></div><div class="form-group" ng-class="{ \'has-error\': loginForm.password.$invalid && (loginForm.password.$dirty || loginForm.$submitted) }"><input class="form-control input-lg" type="password" placeholder="Password" name="password" required ng-model="$ctrl.loginData.password"></div><div ng-messages="loginForm.username.$error"><div ng-message="server.failed">{{$ctrl.errors[\'username\'].message}}</div></div><div ng-messages="loginForm.password.$error"><div ng-message="server.failed">{{$ctrl.errors[\'password\'].message}}</div></div><button type="submit" class="btn btn-primary btn-lg btn-block" ng-disabled="loginForm.$invalid">Submit</button><h5>Don\'t have an account? <a ui-sref="app.register">Register here</a>.</h5></div></form></div>');
  $templateCache.put('./register.html', '<!--<h1 class="text-center">Sign up!</h1>--><div class="row"><form server-validate name="registerForm" ng-submit="$ctrl.register()"><div class="col-md-6 col-md-offset-3 stacked-inputs"><h1><span class="fa fa-user-plus" aria-hidden="true"></span> <span>Register</span></h1><div class="form-group no-margin" ng-class="{ \'has-error\': registerForm.username.$invalid && registerForm.username.$dirty }"><input class="form-control input-lg" placeholder="Username" name="username" required ng-pattern="/^[A-Za-z0-9_@.]*$/" minlength="3" maxlength="20" ng-model="$ctrl.registerData.username"></div><div class="form-group no-margin" ng-class="{ \'has-error\': registerForm.password.$invalid && registerForm.password.$dirty }"><input class="form-control input-lg" type="password" placeholder="Password" name="password" required minlength="8" maxlength="40" ng-model="$ctrl.registerData.password"></div><div class="form-group" ng-class="{ \'has-error\': registerForm.confirmPassword.$invalid && registerForm.confirmPassword.$dirty }"><input class="form-control input-lg" type="password" placeholder="Confirm Password" name="confirmPassword" required compare-to="$ctrl.registerData.password" ng-model="$ctrl.registerData.confirmPassword"></div><div ng-messages="registerForm.username.$error" ng-if="registerForm.username.$dirty && registerForm.username.$invalid"><div ng-message="required">Username required</div><div ng-message="pattern" marked="\'Username must not contain special characters. You may use: `.`, `_`, and `@`.\'"></div><div ng-message="minlength">Username is too short.</div><div ng-message="maxlength">Username is too long.</div><div ng-message="server.failed">{{$ctrl.errors[\'username\'].message}}</div></div><div ng-messages="registerForm.password.$error" ng-if="registerForm.password.$dirty && registerForm.password.$invalid"><div ng-message="required">Password required</div><div ng-message="minlength">Password is too short.</div><div ng-message="maxlength">Password is too long.</div><div ng-message="server.failed">{{$ctrl.errors[\'password\'].message}}</div></div><div ng-messages="registerForm.confirmPassword.$error" ng-if="registerForm.confirmPassword.$dirty && registerForm.confirmPassword.$invalid && $ctrl.registerData.password.length"><div ng-message="required">Confirm password required</div><div ng-message="compareTo">Passwords do not match!</div></div><button type="submit" class="btn btn-primary btn-lg btn-block" ng-disabled="registerForm.$invalid">Sign up</button><h5>Already have an account? <a ui-sref="app.login">Sign in here</a>.</h5></div></form></div>');
  $templateCache.put('./uiBreadcrumbs.tpl.html', '<ol class="breadcrumb"><li ng-repeat="crumb in breadcrumbs" ng-class="{ active: $last }"><a ui-sref="{{ crumb.route }}" ng-if="!$last">{{ crumb.displayName }}&nbsp;</a><span ng-show="$last">{{ crumb.displayName }}</span></li></ol>');
  $templateCache.put('./error-box.html', '<div ng-repeat="error in $ctrl.errors"><div class="well well-sm bg-danger">{{error}}</div></div>errobox');
  $templateCache.put('./article.html', '<header class="row"><div class="avatar col-md-1 hidden-xs"><img src="./img/databaseicon.png"></div><div class="article-title col-md-11"><a ui-sref="app.article.view({articleID: $ctrl.article.articleID})">{{::$ctrl.article.title || \'NO TITLE\'}}</a></div><div class="article-info col-md-11">Posted on {{::$ctrl.article.createdAt | date}} by <a>{{::$ctrl.article.user.username}}</a><div class="article-admin-ctrl" ng-if="$root.session.role.roleID == 2"><button class="btn btn-primary btn-xs" title="edit" ui-sref="app.article.view.edit({articleID: $ctrl.article.articleID})"><span class="fa fa-pencil"></span></button> <button class="btn btn-danger btn-xs" title="remove" ng-click="$ctrl.deleteArticle()"><span class="fa fa-trash"></span></button></div></div></header><div class="article-content"><p marked="::$ctrl.article.body"></p><!--<div style="position: relative">\r\n        <p ng-bind-html="::$ctrl.article.body"></p>\r\n        <div class="fadeout" ng-if="$ctrl.article.body.length > 200"></div>\r\n    </div>\r\n    <div class="article-continue" ng-if="$ctrl.article.body.length > 200">\r\n        <a ui-sref="article({id: $ctrl.article.articleID })">Continue reading...</a>{{$ctrl.article.articleID}}\r\n    </div>--><div class="article-continue text-right"><a ui-sref="app.article.view({articleID: $ctrl.article.articleID})">Comments \xBB</a></div></div><!--\r\n<div class="article-comments text-right">\r\n    <a>34 Comments</a>\r\n</div>-->');
  $templateCache.put('./article-comments-children.html', '<div class="children" ng-if="$ctrl.comments.length > 0"><!--<div class="children" ng-if="$ctrl.comments.length > 0" > ---><div class="comment" ng-repeat="comment in $ctrl.comments" ng-init="comment.hidden = true"><div class="caption" id="{{\'article-\' + comment.articleID + \'-comment-\' + comment.commentID}}" ng-class="::{\'user-comment\' : comment.userID == $root.session.userID}"><div class="comment-body" ng-click="comment.hidden=!comment.hidden" ng-class="{\'clickable\' : comment.replies.length > 0}"><div class="author"><a>{{::comment.user.username}}</a><span class="comment-spacer">{{::comment.createdAt | date:\'short\'}}</span></div><span marked="::comment.body"></span></div><div class="comment-reply-area">{{comment.commentID}}<reply-button comment="comment" article="$ctrl.article" on-post="$ctrl.onPost()"></reply-button></div><div class="comment-info"><div class="comment-reply" ng-if="comment.replies.length > 0"><a class="white-links" ng-click="comment.hidden=!comment.hidden">{{comment.hidden ? \'+ show replies\' : \'- hide replies\'}}</a></div></div><!--<span ng-if="::comment.replyCount > 0">{{comment.replyCount}} replies</span>--><!--<div class="comment-info">\r\n\r\n                <div class="comment-reply">\r\n                    <a class="white-links" ng-if="comment.replies.length > 0"\r\n                       ng-click="comment.hidden=!comment.hidden">\r\n                        {{comment.hidden ? \'+ show replies\' : \'- hide replies\'}}\r\n                    </a>\r\n                </div>\r\n\r\n                <div class="pull-right">\r\n                    <reply-button comment="comment" article="$ctrl.article"></reply-button>\r\n                </div>\r\n                <div class="clearfix"></div>\r\n            </div>--></div><div class="comment-nested-helper"><div id="{{\'commentid-\' + comment.commentID + \'-reply-box\'}}"></div><div class="hider" ng-if="!comment.hidden"><article-comments-children style="display: block" article="$ctrl.article" comments="comment.replies" parent-id="comment.commentID" hide-bool="$ctrl.hidden"></article-comments-children></div></div></div></div>');
  $templateCache.put('./article-comments.html', '<div class="comments-container"><div class="comment-create" ng-switch="!!$root.session"><div ng-switch-when="true"><!--<textarea placeholder="Write a comment..."\r\n                      data-ng-model="$ctrl.pendingComment"\r\n                      id="first" data-ng-show="show"\r\n                      ng-init="show = true"\r\n                      markdown-editor="{\'iconlibrary\': \'fa\', addExtraButtons: true, resize: \'vertical\'}">\r\n            </textarea>\r\n            <div class="comment-create-footer">\r\n                <button class="btn-sm btn btn-default right" ng-click="$ctrl.postComment()" ng-init="thing = 0">Post\r\n                </button>\r\n                <div class="clearfix"></div>\r\n            </div>--><reply-box></reply-box></div><div ng-switch-default class="comment-nologin-info"><h3 class="no-margin text-center"><span class="fa fa-warning"></span> <a ui-sref="app.login">Sign in</a> to post a comment!</h3></div></div><!--<div class="comment-info">{{$ctrl.comments.total}} COMMENTS</div>--><article-comments-children article="$ctrl.article" comments="$ctrl.comments" on-post-comment="$ctrl.postComment" parent-id="root">wut</article-comments-children></div>');
  $templateCache.put('./article-create.html', '<header class="row"><div class="avatar col-md-1"><img src="./img/frakshead.png"></div><div class="article-title col-md-11"><input class="form-control" placeholder="Enter title here..." ng-model="$ctrl.articleTitle"></div><div class="article-info col-md-11">Posted on {{$ctrl.rightNow | date}} by <a>{{::$ctrl.currentUser}}</a></div></header><div class="comment-create"><textarea placeholder="Body of article..." data-ng-model="$ctrl.articleBody" id="first" data-ng-show="show" ng-init="show = true" markdown-editor="{\'iconlibrary\': \'fa\', addExtraButtons: true, resize: \'vertical\'}">\r\n    </textarea></div><button class="btn btn-sm btn-default right" ng-click="$ctrl.postArticle()">Post</button><div class="clearfix"></div>');
  $templateCache.put('./article-page.html', '<article data-article="$ctrl.article"></article><!--<article-comments data-article="$ctrl.article" data-comments="$ctrl.comments.results"></article-comments>--><div class="comments-container"><div class="comment-create" ng-switch="!!$root.session"><div ng-switch-when="true"><reply-box article="$ctrl.article"></reply-box></div><div ng-switch-default class="comment-nologin-info"><h3 class="no-margin text-center"><span class="fa fa-warning"></span> <a ui-sref="app.login">Sign in</a> to post a comment!</h3></div></div><!--<div class="comment-info">{{$ctrl.comments.total}} COMMENTS</div>--><article-comments-children article="$ctrl.article" comments="$ctrl.comments" on-post-comment="$ctrl.postComment" parent-id="\'root\'"></article-comments-children></div>');
  $templateCache.put('./blog.html', '<article ng-repeat="article in $ctrl.articles track by article.articleID" data-article="article"></article>');
  $templateCache.put('./reply-box.html', '<div class="reply-box-cancel-btn" ng-click="$ctrl.hideFn({})"><span class="fa fa-remove"></span></div><div class="comment-create"><textarea placeholder="Write a comment..." data-ng-model="$ctrl.pendingComment" markdown-editor="{\'iconlibrary\': \'fa\', addExtraButtons: true, resize: \'vertical\', fullscreen: {enable: false}}">\r\n        </textarea><div class="comment-create-footer"><button class="btn-sm btn btn-default right" ng-click="$ctrl.postComment()" ng-init="thing = 0">Post</button><div class="clearfix"></div></div></div>');
  $templateCache.put('./reply-button.html', '<!--<button class="btn btn-default btn-xs reply-button" ng-click="$ctrl.addReplyBox()" ng-class="{\'active\': $ctrl.isActive}">\r\n    <span class="fa fa-reply"></span> reply\r\n</button>--><div class="reply-button"><a ng-click="$ctrl.addReplyBox()">reply</a></div>');
}]);})(window.angular);