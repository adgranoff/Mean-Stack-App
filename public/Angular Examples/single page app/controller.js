angular.module('myApp').controller('MainController', MainController).controller('AboutController', AboutController);

function MainController() {

    var vm = this;
    vm.name = 'Adam';
}

function AboutController() {

    var vm = this;
    vm.bio = 'This is my bio';
}