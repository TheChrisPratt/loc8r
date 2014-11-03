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

var _showError = function (req,res,status) {
  var data;
  if(status === 404) {
    data = {
      title: "404: Page Not Found",
      content: "WTF? Looks like we can't find that page.  OFW!"
    };
  } else {
    data = {
      title: status + ": Request Error",
      content: "Something, somewhere, has gone horribly wrong."
    };
  }
  res.status(status);
  res.render("generic-text",data);
}; //_showError

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
    sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about.  Perhaps with coffee, cake or a pint?  Let Loc8r help you find the place you're looking for.",
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
    if(response.statusCode === 200) {
      if(body.length) {
        for(var i = 0;i < body.length;i++) {
          body[i].distance = formatDistance(body[i].distance);
        }
      }
      renderHomepage(req,res,body);
    } else {
      _showError(req,res,response.statusCode);
    }
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

var getLocationInfo = function (req,res,callback) {
  request({
    url: apiOptions.server + "/api/locations/" + req.params.locationId,
    method: "GET",
    json: {}
  },function(err,response,body) {
    if(response.statusCode === 200) {
      body.geocode = {
        lng: body.geocode[0],
        lat: body.geocode[1]
      };
      callback(req,res,body);
    } else {
      _showError(req,res,response.statusCode);
    }
  });
}; //getLocationInfo

/* GET 'Location Info' page */
module.exports.locationInfo = function (req,res) {
  getLocationInfo(req,res,function(req,res,data) {
    renderDetail(req,res,data);
  });
}; //locationInfo

var renderReviewForm = function (req,res,data) {
  res.render("location-review-form",{
    title: "Review " + data.name + " on Loc8r",
    pageHeader: {
      title: "Review " + data.name
    },
    user: {
      displayName: "Chris Pratt"
    },
    error: req.query.err
  });
}; //renderReviewForm

/* GET 'Add Review' page */
module.exports.addReview = function (req,res) {
  getLocationInfo(req,res,function(req,res,data) {
    renderReviewForm(req,res,data);
  });
}; //addReview

module.exports.createReview = function (req,res) {
  if(req.body.name && req.body.rating && req.body.review) {
    request({
      url: apiOptions.server + "/api/locations/" + req.params.locationId + "/reviews",
      method: "POST",
      json: {
        author: {
          displayName: req.body.name
        },
        rating: parseInt(req.body.rating,10),
        comments: req.body.review
      }
    },function(err,response,body) {
      if(response.statusCode === 201) {
        res.redirect("/location/" + req.params.locationId);
      } else if((response.statusCode === 400) && body.name && (body.name === "ValidationError")) {
        res.redirect("/location/" + req.params.locationId + "/reviews/new?err=val");
      } else {
        _showError(req,res,response.statusCode);
      }
    });
  } else {
    res.redirect("/location/" + req.params.locationId + "/reviews/new?err=val");
  }
}; //createReview