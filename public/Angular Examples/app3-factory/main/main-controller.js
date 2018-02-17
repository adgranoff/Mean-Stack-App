angular.module('myApp').controller('MainController', MainController);

function MainController(HotelFactory) {

    var vm = this;

    HotelFactory.getAllHotels().then(function(response) {
        vm.hotels = response;
    });

    vm.name = 'Adam';

    vm.date1 = '12 Feburary 2016';
    vm.date2 = '11 March 2016';
    vm.date3 = '07 January 2015';
    vm.date4 = '25 April 2014';
}