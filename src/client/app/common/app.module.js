angular
    .module('common', [
        'ui.router',
        'ngResource',
        'ngAnimate',
        'ngSanitize',
        'ngMessages',
        'directives',
        'angularUtils.directives.uiBreadcrumbs',
        /*'monospaced.elastic',*/
        'hc.marked', 'hljs', 'angular-markdown-editor', 'duScroll'])
    .config(['markedProvider', 'hljsServiceProvider', function(markedProvider, hljsServiceProvider) {
        // marked config
        markedProvider.setOptions({
            gfm: true,
            tables: true,
            sanitize: true,
            highlight: function (code, lang) {
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
    }]);