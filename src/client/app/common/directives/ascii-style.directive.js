function rando(id) {
    return (id || '') + '_' + Math.random().toString(36).substr(2, 9);
}


function make_border_style(elem, text, color, bg, $parent) {


    var $test_div = $('<div style="position: absolute; margin: 0; padding: 0; border: 0 none; opacity: 0; left: -9999em;">X</div>').appendTo($parent || 'body');

    $parent = $($parent || 'body');
    let selector = rando('ascii-border'); //'.text-box';
    $(elem).attr('id', selector);
    selector = '#' + selector;
    text = text || '╔═╗║ ║╚═╝';
    var lines = text.match(/.../g);

    var cw = parseInt($test_div.innerWidth());
    var ch = parseInt($test_div.innerHeight());
    var ff = $test_div.css('font-family');
    var fs = parseInt($test_div.css('font-size'));
    var vpad = (ch - fs) / 2;
    var w = cw * 3, h = ch * 3;
    $test_div.remove();

    var canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    var ctx = canvas.getContext("2d");
    ctx.font = fs + 'px ' + ff;

    if(bg !== 'transparent' && bg) {
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, w, h);
    }

    ctx.fillStyle = color || $parent.css('color');
    ctx.fillText(lines[0], 0, fs+vpad);
    ctx.fillText(lines[1], 0, fs+vpad+ch);
    ctx.fillText(lines[2], 0, fs+vpad+ch*2);
    var durl = canvas.toDataURL();
    $('<style type="text/css">'+selector+'{ border-width:'+ch+'px '+ cw +'px; border-image:url("' + durl + '") ' + ch + ' ' + cw + ' repeat</style>').appendTo('body');
}

function make_text_background_image(elem, text, color, $parent) {


    $parent = $($parent || 'body');
    let selector = rando('ascii-bg'); //'.text-box';
    $(elem).attr('id', selector);
    selector = '#' + selector;
    text = text || 'X';

    var $test_div = $('<div style="position: absolute; margin: 0; padding: 0; border: 0 none; opacity: 0; left: -9999em;">' + text + '</div>').appendTo($parent || 'body');

    var w = $test_div.innerWidth();
    var h = $test_div.innerHeight();
    var ff = elem.css('font-family');
    var fs = parseInt($test_div.css('font-size'));
    var vpad = (h - fs) / 2;

    $test_div.remove();

    var canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    var ctx = canvas.getContext("2d");
    ctx.font = fs + 'px ' + ff;
    ctx.fillStyle = color || $parent.css('color') || '#000';
    ctx.fillText(text, 0, fs+vpad);
    var durl = canvas.toDataURL();
    $('<style type="text/css">'+selector+'{background-image:url("' + durl + '"); }</style>').appendTo('body');
}


function asciiBorder () {
    return {
        scope: {
            asciiBorder: '<'
        },
        bindToController: true,
        restrict: 'A',
        link: function ($scope, $elem, $attrs) {
            let props = $scope.$eval($attrs.asciiBorder);
            let def = ['╒═■│ │└─┘', 'white', 'transparent', 'body'];

            make_border_style($elem, props[0] || def[0], props[1] || def[1], props[2] || def[2], props[3] || def[3]);
        },
        controller: function() {
            console.log(this);
        }
    };
}

function asciiBg () {
    return {
        restrict: 'A',
        scope: {
            asciiBg: '<'
        },
        link: function ($scope, $elem, $attrs) {
            let props = $scope.$eval($attrs.asciiBg);
            if(!props) props = ['▒','#066'];

            console.log(props);

            make_text_background_image($elem, props[0], props[1], props[2]);
        }
    };
}

angular
    .module('common')
    .directive('asciiBorder', asciiBorder)
    .directive('asciiBg', asciiBg);