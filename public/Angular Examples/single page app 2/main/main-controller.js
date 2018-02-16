angular.module('myApp').controller('MainController', MainController);

function MainController($http) {

    var vm = this;

    $http.get('http://localhost:3000/api/hotels').then(function(response){
        vm.hotels = response.data;
    });
    vm.name = 'Adam';
}