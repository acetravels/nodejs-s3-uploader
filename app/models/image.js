var mongoose = require('mongoose')
  , Schema = mongoose.Schema

/**
 * Amenity Schema
 */

var ImageSchema = new Schema({
	image_id: String,
	title:String,
	description:String,
	sizes: [{
		"w": String,
		"h": String
	}]
 })
mongoose.model('Image', ImageSchema)