angular.module('myApp').controller('HotelController', HotelController);

function HotelController($routeParams, HotelFactory) {

    var vm = this;
    var id = $routeParams.id;

    HotelFactory.getOneHotel(id).then(function(response) {
        vm.hotels = response;
    });

}