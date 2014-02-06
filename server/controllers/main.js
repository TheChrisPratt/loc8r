/* GET 'about us' page */
module.exports.about = function (req,res) {
	res.render("index",{ title: "About" });
};

/* GET 'sign in' page */
module.exports.signin = function (req,res) {
	res.render("index",{ title: "Sign in" });
};