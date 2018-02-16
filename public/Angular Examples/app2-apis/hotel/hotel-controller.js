angular.module('myApp').controller('HotelController', HotelController);

function HotelController($http, $routeParams) {

    var vm = this;
    var id = $routeParams.id;
    $http.get('http://localhost:3000/api/hotels/' + id).then(function(response){
        vm.hotels = response.data;
    });

}