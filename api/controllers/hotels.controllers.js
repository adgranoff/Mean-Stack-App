var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');

var runGeoQuery = function(req, res) {

    var lng = parseFloat(req.query.lng);
    var lat = parseFloat(req.query.lat);

    // error trap if coords not number
    if (isNaN(lng) || isNaN(lat)) {
        res
          .status(400)
          .json({
            "message" : "Supplied in querystring, lng and lat must both be numbers"
          });
        return;
      }

    // a geoJSON point

    var point = {
        type : "Point",
        coordinates : [lng, lat]
    };

     // code did not work in later verison of mongoose so used below

    // var geoOptions = {
    //     spherical : true,
    //     maxDistance : 2000,
    //     num : 5
    // };
    
   
    // Hotel
    //     .geoNear(point, geoOptions, function (err, results, stats) {
    //         console.log('Geo results', results);
    //         console.log('Geo stats', stats);
    //         res
    //             .status(200)
    //             .json(results);
    //     });

    Hotel.aggregate(
        [
            {
                '$geoNear': {
                    'near': point,
                    'spherical': true,
                    'distanceField': 'dist',
                    'maxDistance': 2000,
                    'num' : 5
                }
            }
        ],
        function(err, results) {
            console.log('Geo results', results);
            if (err) {
                console.log("Error finding hotels");
                res
                    .status(500)
                    .json(err);
            } else {  
            res
                .status(200)
                .json(results);
            }
        });
};

module.exports.hotelsGetAll = function(req, res) {
    
    var offset = 0;
    var count = 5;
    var maxCount = 10;

    if (req.query && req.query.lat && req.query.lng) {
        runGeoQuery(req, res);
        return;
    }

    if (req.query && req.query.offset) {
         offset = parseInt(req.query.offset, 10);
     }

    if (req.query && req.query.count) {
         count = parseInt(req.query.count, 10);
     }

     // error trap if offset or count are not numbers
     if (isNaN(offset) || isNaN(count)) {
        res
            .status(400)
            .json({
                "message" : "Supplied querystring count and offset should be a number"
            }); 
        return;
     }

     // error trap count larger than 10
     if (count > maxCount) {
         res    
           .status(400)
           .json({
               "message" : "Supplied querystring count more than max of 10"
           });
           return;
     }

     Hotel
        .find()
        .skip(offset)
        .limit(count)
        .exec(function(err, hotels) {
            if (err) {
                console.log("Error finding hotels");
                res
                   .status(500)
                   .json(err);
            } else {
            console.log("Found Hotels", hotels.length);
            res
                .json(hotels);
            }
        });
};

module.exports.hotelsGetOne = function(req, res) {
    var hotelId = req.params.hotelId;
    console.log("GET hotelID", hotelId);
        
    Hotel
        .findById(hotelId)    
        .exec(function(err, doc) {
            var response = {
                status : 200,
                message : doc
            };
              if (err) {
                console.log("Error finding hotel");
                response.status = 500;
                response.message = err;
            } else if(!doc) {
                response.status = 404;
                response.message = {
                    "message" : "Hotel ID Not Found"
                };
            } 
            res
                .status(response.status)
                .json(response.message);
        });
};

// helper function for AddOne arrays

var _splitArray = function(input) {
    var output;
    if (input && input.length > 0) {
        output = input.split(";");
    } else {
        output = [];
    }
    return output;
    };



module.exports.hotelsAddOne = function(req, res) {
    Hotel
        .create({
            name : req.body.name,
            description : req.body.description,
            stars : parseInt(req.body.stars, 10),
            name : req.body.name,
            services : _splitArray(req.body.services),
            photos : _splitArray(req.body.photos),
            currency : req.body.currency,
            location : {
                address : req.body.address,
                coordinates : [
                    parseFloat(req.body.lng), 
                    parseFloat(req.body.lat)
                ]
            }
        }, function(err, hotel) {
            if (err) {
                console.log("Error creating hote");
                res
                    .status(400)
                    .json(err);
            } else {
                console.log("Hotle created", hotel);
                res
                    .status(201)
                    .json(hotel);
            }
        });    
};

module.exports.hotelsUpdateOne = function(req, res) {
    var hotelId = req.params.hotelId;
    console.log("GET hotelID", hotelId);
        
    Hotel
        .findById(hotelId)
        .select("-reviews -rooms")    
        .exec(function(err, doc) {
            var response = {
                status : 200,
                message : doc
            };
              if (err) {
                console.log("Error finding hotel");
                response.status = 500;
                response.message = err;
            } else if(!doc) {
                response.status = 404;
                response.message = {
                    "message" : "Hotel ID Not Found"
                };
            } 
            if (response.status !== 200){
                res
                 .status(response.status)
                 .json(response.message);
            } else {
                doc.name = req.body.name;
                doc.description = req.body.description;
                doc.stars = parseInt(req.body.stars, 10);
                doc.name = req.body.name;
                doc.services = _splitArray(req.body.services);
                doc.photos = _splitArray(req.body.photos);
                doc.currency = req.body.currency;
                doc.location = {
                    address : req.body.address,
                    coordinates : [
                        parseFloat(req.body.lng), 
                        parseFloat(req.body.lat)
                    ]
                }; 
                doc.save(function(err, hotelUpdated){
                    if(err) {
                        res
                            .status(500)
                            .jason(err);
                    } else {
                        res 
                            .status(204)
                            .json();
                    }
                });  
            }
        });
    };

    module.exports.hotelsDeleteOne = function(req, res) {
        var hotelId = req.params.hotelId;
      
        Hotel
          .findByIdAndRemove(hotelId)
          .exec(function(err, location) {
            if (err) {
              res
                .status(404)
                .json(err);
            } else {
              console.log("Hotel deleted, id:", hotelId);
              res
                .status(204)
                .json();        
            }
          });
      };