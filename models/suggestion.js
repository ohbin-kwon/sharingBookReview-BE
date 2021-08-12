import mongoose from 'mongoose'

const suggestionSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		immutable: true,
	},
	content: {
		type: String,
	},
	created_at: {
		type: Date,
		default: Date.now,
	},
})

export default mongoose.model('Suggestion', suggestionSchema)