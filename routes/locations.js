var ctrl = require("../server/controllers/locations");

module.exports = function (app) {
	app.get("/",ctrl.homelist);
	app.get("/location/:locationId",ctrl.locationInfo);
	app.get("/location/review/new",ctrl.addReview);
};