import mongoose from 'mongoose'
import { commentSchema } from './comment.js'

const collectionSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		enum: ['tag', 'custom', 'best', 'genre'],
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	contents: [{
		book: {
			type: String,
			ref: 'Book',
			required: true,
			alias: 'isbn',
		},
		book_description: String,
	}],
	image: String,
	description: String,
	comments: [commentSchema],
	liked_users: {
		type: [mongoose.Schema.Types.ObjectId],
		ref: 'User',
	},
	created_at : {
		type: Date,
		default: Date.now,
		immutable: true
	}
})

export default mongoose.model('Collection', collectionSchema)