/* GET 'home' page */
module.exports.homelist = function (req,res) {
	res.render("index",{ title: "Home" });
};

/* GET 'Location Info' page */
module.exports.locationInfo = function (req,res) {
	res.render("index",{ title: "Location info" });
};

/* GET 'Add Review' page */
module.exports.addReview = function (req,res) {
	res.render("index",{ title: "Add review" });
};