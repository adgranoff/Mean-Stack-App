angular.module('myApp').factory('HotelFactory', HotelFactory);

function HotelFactory($http) {
return {
    getAllHotels : getAllHotels,
    getOneHotel : getOneHotel
};

function getAllHotels() {
    return $http.get('http://localhost:3000/api/hotels').then(complete).catch(failed);
}

function getOneHotel(id) {
    return $http.get('http://localhost:3000/api/hotels/' + id).then(complete).catch(failed);
}

function complete(response) {
    return response.data;
}

function failed(response) {
    return error.statusText;
}

}
