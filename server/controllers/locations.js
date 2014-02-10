/* GET 'home' page */
module.exports.homelist = function (req,res) {
  var data = {
    title: "Loc8r - find a place to work with wifi",
    pageHeader: {
      title: "Loc8r",
      subtitle: "Find places to work with wifi near you!"
    },
    sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about.  Perhaps with coffee, cake or a pint?  let Loc8r help you find the place you're looking for.",
    locations: [{
      name: "Starcups",
      address: "125 High Street, Reading, RG6 1PS",
      distance: "100m",
      rating: 3,
      facilities: ["Hot drinks","Food","Premium wifi"]
    },{
      name: "Mints Euro Asian Cuisine",
      address: "11088 Olson Dr, Rancho Cordova, CA 95670",
      distance: "1.3mi",
      rating: 3.5,
      facilities: ["Chinese","Euro Asian","Walkable"]
    },{
      name: "Sala Thai",
      address: "3101 Zinfandel Dr, Rancho Cordova, CA 95670",
      distance: "0.6mi",
      rating: 4.5,
      facilities: ["Thai","Walkable"]
    },{
      name: "Cafe Hero",
      address: "126 High Street, Reading, RG6 1PS",
      distance: "200m",
      rating: 4,
      facilities: ["Hot drinks","Food","Premium wifi"]
    },{
      name: "Burger Queen",
      address: "127 High Street, Reading, RG6 1PS",
      distance: "250m",
      rating: 2,
      facilities: ["Food","Premium wifi"]
    }]
  };
  res.render("locations-list",data);
};

/* GET 'Location Info' page */
module.exports.locationInfo = function (req,res) {
  var data = {
    title: "Starcups",
    pageHeader: {
      title: "Starcups"
    },
    sidebar: {
      context: "is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.",
      callToAction: "If you've been and you like it - or if you don't - please leave a review to help other people just like you."
    },
    location: {
      name: "Starcups",
      address: "125 High Street, Reading, RG6 1PS",
      geocode: {
        lat: 51.455041,
        lng: -0.9690884
      },
      rating: 3,
      facilities: ["Hot drinks","Food","Premium wifi"],
      hours: [{
        days: "Monday - Friday",
        opening: "8:00am",
        closing: "5:00pm",
        closed: false
      },{
        days: "Saturday",
        opening: "8:00am",
        closing: "5:00pm",
        closed: false
      },{
        days: "Sunday",
        closed: true
      }],
      reviews: [{
        author: "Simon Holmes",
        rating: 5,
        timestamp: "16 July 2013",
        comments: "What a great place.  I Can't say enough good things about it."
      },{
        author: "Charlie Chaplin",
        rating: 3,
        timestamp: "16 June 2013",
        comments: "It was okay.  Coffee wasn't great, but the wifi was fast."
      }]
    }
  };
  res.render("location-info",data);
};

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