var ctrl = require("../server/controllers/locations");

module.exports = function (app) {
	app.get("/",ctrl.homelist);
	app.get("/location/:locationId",ctrl.locationInfo);
	app.get("/location/:locationId/reviews/new",ctrl.addReview);
  app.post("/location/:locationId/reviews/new",ctrl.createReview);
};