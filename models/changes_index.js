import { Schema, model } from 'mongoose'
import { KoreaTime } from './utilities.js'

const changesIndexSchema = new Schema(
	{
	isbn: Number,
	created_at: { type: Date, default: Date.now, },
})

KoreaTime(changesIndexSchema)

export default model('ChangesIndex', changesIndexSchema)