angular.module('myApp').controller('MainController', MainController);

function MainController(HotelFactory) {

    var vm = this;

    HotelFactory.getAllHotels().then(function(response) {
        vm.hotels = response;
    });

    vm.name = 'Adam';
}