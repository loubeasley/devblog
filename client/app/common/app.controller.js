function AppController($state) {
    var ctrl = this;
    console.log(ctrl);
}

angular
    .module('common')
    .controller('AppController', AppController);