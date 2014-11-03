var util = require('util');
var mongoose = require('mongoose');
var locations = mongoose.model("Location");

var earth = (function () {
  var earthRadiusKM = 6371;
  var earthRadiusMi = 3959;

  var toDistance = function (rads,radius) {
    return parseFloat(rads * radius);
  }; //toDistance

  var fromDistance = function (dist,radius) {
    return parseFloat(dist / radius);
  }; //fromDistance

  var toKM = function (rads) {
    return toDistance(rads,earthRadiusKM);
  }; //toKM

  var toMiles = function (rads) {
    return toDistance(rads,earthRadiusMi);
  }; //toMiles

  var fromKM = function (dist) {
    return fromDistance(dist,earthRadiusKM);
  }; //fromKM

  var fromMiles = function (dist) {
    return fromDistance(dist,earthRadiusMi);
  }; //fromMiles

  return {
    toKM: toKM,
    toMiles: toMiles,
    fromKM: fromKM,
    fromMiles: fromMiles
  }
})();

var updateAverageRating = function (locationId) {
  locations.findById(locationId).select('rating reviews').exec(function(err,location) {
    if(!err) {
      var i, count, total;
      if(location.reviews && (location.reviews.length > 0)) {
        total = 0;
        count = location.reviews.length;
        for(i = 0;i < count;i++) {
          total += location.reviews[i].rating;
        }
        location.rating = parseInt(total / count,10);
        location.save(function(err) {
          if(err) {
            console.log(err);
          } else {
            console.log("Average rating updated to ",location.rating);
          }
        });
      }
    }
  });
}; //updateAverageRating

var sendJSONResponse = function (res,status,content) {
  res.status(status);
  res.json(content);
}; //sendJSONResponse

module.exports.listLocationsByDistance = function(req,res) {
  var lat = parseFloat(req.query.lat);
  var lng = parseFloat(req.query.lng);
  if((lat || (lat === 0)) && (lng || (lng === 0))) {
    console.log("Getting Locations by Distance");
    var origin = {
      type: "Point",
      coordinates: [lng,lat]
    };
    console.log("Searching from: " + util.inspect(origin));
    var options = {
      spherical: true,
      num: (req.query.page) ? parseInt(req.query.page,10) : 10,
      maxDistance: earth.fromMiles((req.query.max) ? parseFloat(req.query.max) : 15.0)
    };
    console.log("Search Options: " + util.inspect(options));
    locations.geoNear(origin,options,function (err,docs,stats) {
      if(!err) {
        var locations = [];
        console.log("Found " + docs.length + " document(s)");
        docs.forEach(function(doc) {
          locations.push({
            name: doc.obj.name,
            address: doc.obj.address,
            rating: doc.obj.rating,
            facilities: doc.obj.facilities,
            distance: earth.toMiles(doc.dis),
            _id: doc.obj._id
          });
        });
        console.log("Returning " + locations.length + " location(s)");
        sendJSONResponse(res,200,locations);
      } else {
        sendJSONResponse(res,400,err);
      }
    });
  } else {
    sendJSONResponse(res,404,{"error": "geocode.missing","message": "lat and lng query parameters are required"});
  }
}; //listLocationsByDistance

module.exports.createLocation = function(req,res) {
  locations.create({
    name: req.body.name,
    address: req.body.address,
    facilities: req.body.facilities.split(',\s*'),
    geocode: [parseFloat(req.body.lng),parseFloat(req.body.lat)],
    hours: [{
      days: req.body.days1,
      opening: req.body.opening1,
      closing: req.body.closing1,
      closed: req.body.closed1
    },{
      days: req.body.days2,
      opening: req.body.opening2,
      closing: req.body.closing2,
      closed: req.body.closed2
    }]
  },function(err,location) {
    if(!err) {
      sendJSONResponse(res,201,location);
    } else {
      sendJSONResponse(res,400,err);
    }
  })
}; //createLocation

module.exports.getLocation = function(req,res) {
  if(req.params && req.params.locationId) {
    locations.findById(req.params.locationId).exec(function(err,location) {
      if(err) {
        sendJSONResponse(res,400,err);
      } else if(location) {
        sendJSONResponse(res,200,location);
      } else {
        sendJSONResponse(res,404,{"error": "location.not.found","message": "Location ID " + req.params.locationId + " not found"});
      }
      console.log("findById complete");
    });
  } else {
    sendJSONResponse(res,400,{"error": "locationId.missing","message": "No Location ID was found in the request"});
  }
}; //getLocation

module.exports.updateLocation = function(req,res) {
	if(req.params.locationId) {
    locations.findById(req.params.locationId).select('-reviews -rating').exec(function(err,location) {
      if(err) {
        sendJSONResponse(res,400,err);
      } else if(location) {
        location.name = req.body.name;
        location.address = req.body.address;
        location.facilities = req.body.facilities.split(',%s*');
        location.geocode = [parseFloat(req.body.lng),parseFloat(req.body.lat)];
        location.hours = [{
          days: req.body.days1,
          opening: req.body.opening1,
          closing: req.body.closing1,
          closed: req.body.closed1
        },{
          days: req.body.days2,
          opening: req.body.opening2,
          closing: req.body.closing2,
          closed: req.body.closed2
        }];
        location.save(function(err,location) {
          if(err) {
            sendJSONResponse(res,400,err);
          } else {
            sendJSONResponse(res,200,location);
          }
        })
      } else {
        sendJSONResponse(res,404,{"error": "location.not.found","message": "Location ID " + req.params.locationId + " not found"});
      }
    });
  } else {
    sendJSONResponse(res,400,{"error": "locationId.missing","message": "No Location ID was found in the request"});
  }
}; //updateLocation

module.exports.deleteLocation = function(req,res) {
	if(req.params.locationId) {
    locations.findByIdAndRemove(req.params.locationId).exec(function(err,location) {
      if(err) {
        sendJSONResponse(res,400,err);
      } else {
        sendJSONResponse(res,204,null);
      }
    });
  } else {
    sendJSONResponse(res,400,{"error": "locationId.missing","message": "No Location ID was found in the request"});
  }
}; //deleteLocation

module.exports.createReview = function(req,res) {
	if(req.params.locationId) {
    locations.findById(req.params.locationId).select('reviews').exec(function(err,location) {
      if(err) {
        sendJSONResponse(res,400,err);
      } else if(location) {
        location.reviews.push({
          author: req.body.author,
          rating: req.body.rating,
          timestamp: Date.now(),
          comments: req.body.comments
        });
        location.save(function(err,location) {
          if(err) {
            console.log(err);
            sendJSONResponse(res,400,err);
          } else {
            updateAverageRating(location._id);
            sendJSONResponse(res,201,location.reviews[location.reviews.length - 1]);
          }
        });
      } else {
        sendJSONResponse(res,404,{"error": "location.not.found","message": "Location ID " + req.params.locationId + " not found"});
      }
    });
  } else {
    sendJSONResponse(res,400,{"error": "locationId.missing","message": "No Location ID was found in the request"});
  }
}; //createReview

module.exports.getReview = function(req,res) {
  if(req.params && req.params.locationId && req.params.reviewId) {
    locations.findById(req.params.locationId).select('name reviews').exec(function(err,location) {
      if(err) {
        sendJSONResponse(res,400,err);
      } else if(location) {
        if(location.reviews && (location.reviews.length > 0)) {
          var review = location.reviews.id(req.params.reviewId);
          if(review) {
            sendJSONResponse(res,200,{ location: { name: location.name, id: req.params.locationId }, review: review});
          } else {
            sendJSONResponse(res,404,{"error": "review.not.found","message": "Review ID " + req.params.reviewId + " not found for location " + req.params.locationId});
          }
        } else {
          sendJSONResponse(res,404,{"error": "no.reviews","message": "No reviews found"});
        }
      } else {
        sendJSONResponse(res,404,{"error": "location.not.found","message": "Location ID " + req.params.locationId + " not found"});
      }
      console.log("findById complete");
    });
  } else {
    sendJSONResponse(res,400,{"error": "locationId.reviewId.missing","message": "LocationId and/or ReviewId missing"});
  }
}; //getReview

module.exports.updateReview = function(req,res) {
	if(req.params && req.params.locationId && req.params.reviewId) {
    locations.findById(req.params.locationId).select('reviews').exec(function(err,location) {
      if(err) {
        sendJSONResponse(res,400,err);
      } else if(location) {
        if(location.reviews && (location.reviews.length > 0)) {
          var review = location.reviews.id(req.params.reviewId);
          if(review) {
            review.author = req.body.author;
            review.rating = req.body.rating;
            review.comments = req.body.comments;
            location.save(function(err,location) {
              if(err) {
                sendJSONResponse(res,400,err);
              } else {
                updateAverageRating(location._id);
                sendJSONResponse(res,200,review);
              }
            });
          } else {
            sendJSONResponse(res,404,{"error": "review.not.found","message": "Review ID " + req.params.reviewId + " not found for location " + req.params.locationId});
          }
        }
      } else {
        sendJSONResponse(res,404,{"error": "location.not.found","message": "Location ID " + req.params.locationId + " not found"});
      }
    });
  } else {
    sendJSONResponse(res,400,{"error": "locationId.reviewId.missing","message": "LocationId and/or ReviewId missing"});
  }
}; //updateReview

module.exports.deleteReview = function(req,res) {
	if(req.params && req.params.locationId && req.params.reviewId) {
    locations.findById(req.params.locationId).select('reviews').exec(function(err,location) {
      if(err) {
        sendJSONResponse(res,400,err);
      } else if(location) {
        if(location.reviews && (location.reviews.length > 0)) {
          var review = location.reviews.id(req.params.reviewId);
          if(review) {
            review.remove();
            location.save(function(err) {
              if(err) {
                sendJSONResponse(res,400,err);
              } else {
                updateAverageRating(location._id);
                sendJSONResponse(res,204,null);
              }
            });
          } else {
            sendJSONResponse(res,404,{"error": "review.not.found","message": "Review ID " + req.params.reviewId + " not found for location " + req.params.locationId});
          }
        }
      } else {
        sendJSONResponse(res,404,{"error": "location.not.found","message": "Location ID " + req.params.locationId + " not found"});
      }
    });
  } else {
    sendJSONResponse(res,404,{"error": "locationId.reviewId.missing","message": "LocationId and/or ReviewId missing"});
  }
}; //deleteReview
