/* Generate and apply border styles on load */

$(window).on('load', function () {
   // make_border_style('#box1');
    //make_border_style('#box2', '╒═■│ │└─┘');
    //make_border_style('.header__img', '+=+| |+-+', 'yellow');
    //make_text_background_image('header.header','▒','#066');
});

/* Background style */

function make_text_background_image(selector, text, color, $parent) {
    $parent = $($parent || 'body');
    selector = selector || '.char-bg';
    text = text || 'X';

    var $test_div = $('<div class="asciid" style="position: absolute; margin: 0; padding: 0; border: 0 none; opacity: 0; left: -9999em;">' + text + '</div>').appendTo($parent || 'body');

    var w = $test_div.innerWidth();
    var h = $test_div.innerHeight();
    var ff = $test_div.css('font-family');
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

/* ASCII-art borders */

function make_border_style(selector, text, color, $parent) {
    var $test_div = $('<div style="position: absolute; margin: 0; padding: 0; border: 0 none; opacity: 0; left: -9999em;">X</div>').appendTo($parent || 'body');

    $parent = $($parent || 'body');
    selector = selector || '.text-box';
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
    ctx.fillStyle = color || $parent.css('color');
    ctx.fillText(lines[0], 0, fs+vpad);
    ctx.fillText(lines[1], 0, fs+vpad+ch);
    ctx.fillText(lines[2], 0, fs+vpad+ch*2);
    var durl = canvas.toDataURL();
    $('<style type="text/css">'+selector+'{ border-width:'+ch+'px '+ cw +'px; border-image:url("' + durl + '") ' + ch + ' ' + cw + ' repeat</style>').appendTo('body');
}

/* Set up the "Block cursor" and some PoC that the buttons are clickable */

$(document).on('ready', function () {
    // -- Block cursor --
    var offset = [], dims = [], $body, $cursor;
    $body = $('body');
    $cursor = $('<div style="position:absolute;margin:0;padding:0;cursor:none;background-color:#000;z-index:9001;pointer-events:none;">▒</div>').appendTo($body);
    offset = [($body.outerWidth() - $body.innerWidth()) / 2, ($body.outerHeight() - $body.innerHeight()) / 2];
    dims = [$cursor.width(), parseInt($cursor.css('line-height'))];

    $(window).on('mousemove', function (e) {
        var left, top;
        left = Math.round((e.pageX - dims[0] / 2) / dims[0]) * dims[0] + offset[0];
        top = Math.round((e.pageY - dims[1] / 2) / dims[1]) * dims[1] + offset[1];
        $cursor.css({ top: top , left: left });
    });

    // -- Button clickability test --
    $('body').on('click', 'button', function (e) {
        alert('You clicked: ' + $(this).text());
    });
});