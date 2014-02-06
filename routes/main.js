var ctrl = require("../server/controllers/main");

module.exports = function (app) {
	app.get("/",ctrl.index);
};