function ArticleController() {
    var ctrl = this;
    //console.log(ctrl);

    ctrl.$onInit = function () {
        //console.log("WE DID THE THINGF");
    }
}

angular
    .module('components.blog')
    .controller('ArticleController', ArticleController);