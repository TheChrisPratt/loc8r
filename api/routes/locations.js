var ctrl = require('../controllers/locations');

module.exports = function(app) {
		// locations
	app.get('/api/locations',ctrl.listLocationsByDistance);
	app.post('/api/locations',ctrl.createLocation);
	app.get('/api.locations/:locationId',ctrl.getLocation);
	app.put('/api/locations/:locationId',ctrl.updateLocation);
	app.delete('/api/locations/:locationId',ctrl.deleteLocation);
	
		// reviews
	app.post('/api/locations/:locationId/reviews',ctrl.createReview);
	app.get('/api/locations/:locationId/reviews/:reviewId',ctrl.getReview);
	app.put('/api/location/:locationId/reviews/:reviewId',ctrl.updateReview);
	app.delete('/api/location/:locationId/reviews/:reviewId',ctrl.deleteReview);
};