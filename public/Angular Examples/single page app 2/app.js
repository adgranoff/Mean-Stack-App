angular.module('myApp', ['ngRoute']).config(config);

function config($routeProvider) {

    $routeProvider.when('/', {

        templateUrl: 'main/main.html',
        controller: 'MainController',
        controllerAs: 'vm'
    }).when('/hotel/:id', {
        templateUrl: 'hotel/hotel.html',
        controller: 'HotelController',
        controllerAs: 'vm'
    }).otherwise({
        redirectTo: '/'
    })
}
