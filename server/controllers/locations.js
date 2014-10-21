var request = require('request');

var apiOptions = {
  server: "http://localhost:3000"
};

if(process.env.NODE_ENV === 'production') {
  apiOptions.server = "http://planetpratt.com:3000";
}

var formatDistance = function (distance) {
  if(distance > 1) {
    return parseFloat(distance).toFixed(1) + ' mi';
  } else {
    return parseInt(distance * 1760,10) + ' yds';
  }
}; //formatDistance

var renderHomepage = function (req,res,data) {
  var message;
  if(data instanceof Array) {
    if(!data.length) {
      message = "No places found nearby";
    }
  } else {
    message = "API lookup error";
    data = [];
  }
  res.render("locations-list",{
    title: "Loc8r - find a place to work with wifi",
    pageHeader: {
      title: "Loc8r",
      subtitle: "Find places to work with wifi near you!"
    },
    sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about.  Perhaps with coffee, cake or a pint?  let Loc8r help you find the place you're looking for.",
    locations: data,
    message: message
  });
}; //renderHomepage

/* GET 'home' page */
module.exports.homelist = function (req,res) {
  request({
    url: apiOptions.server + "/api/locations",
    method: "GET",
    json: {},
    qs: {
      lng: -1.00,
      lat: 51.455144,
      max: 25,
      page: 10
    }
  },function(err,response,body) {
    if((response.statusCode === 200) && body.length) {
      for(var i = 0;i < body.length;i++) {
        body[i].distance = formatDistance(body[i].distance);
      }
    }
    renderHomepage(req,res,body);
  })
}; //homelist

/* GET 'Location Info' page */
var renderDetail = function (req,res,data) {
  res.render("location-info",{
    title: data.name,
    pageHeader: {
      title: data.name
    },
    sidebar: {
      context: "is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.",
      callToAction: "If you've been and you like it - or if you don't - please leave a review to help other people just like you."
    },
    location: data
  });
}; //renderDetail

/* GET 'Location Info' page */
module.exports.locationInfo = function (req,res) {
  request({
    url: apiOptions.server + "/api/locations/" + req.params.locationId,
    method: "GET",
    json: {}
  },function(err,response,body) {
    body.geocode = {
      lng: body.geocode[0],
      lat: body.geocode[1]
    }
    renderDetail(req,res,body);
  });
}; //locationInfo

/* GET 'Add Review' page */
module.exports.addReview = function (req,res) {
  var data = {
    title: "Review Starcups on Loc9r",
    pageHeader: {
      title: "Review Starcups"
    },
    user: {
      displayName: "Simon Holmes"
    }
  };
  res.render("location-review-form",data);
};