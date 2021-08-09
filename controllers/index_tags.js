/**
 * Index tags of each book's reviews.
 * Operates every one hour
 */
import { Book, ChangeIndex } from '../models/index.js'
import schedule from 'node-schedule'

/**
 * Returns unique isbns which have changed after the last run.
 * Marks returned documents' indexed property as true, so it can be deleted later.
 * @returns {Promise<Set<Number>>}
 */
const getChanges = async () => {

	const changes = await ChangeIndex.find({})

	await Promise.allSettled([
		...changes.map(change => {
			change.indexed = true
			return change.save()
		})])

	return new Set(changes.map(change => change.isbn))
}

/**
 * 1. Execute callback every minute.
 * @type {Job}
 */
const job = schedule.scheduleJob('0 * * * * *', async () => {
	// 2. Get set of isbn which have changed after last execution.
	const changedISBNs = await getChanges()
	// 3. Clear ChangeIndexes table
	// 3.1. In case of addition to the table while executing the function above, use indexed property to only delete appropriate ones.
	await ChangeIndex.deleteMany({ indexed: true })
	// 4. Find corresponding book documents by set of isbn and populate reviews.
	const books = await Book.find({
		_id: {
			$in: [...changedISBNs],
		},
	}).populate('reviews')

	// 5. Traverse the books
	// noinspection ES6MissingAwait
	books.forEach(async (book) => {
		// 6. Get array of all the tags of all the reviews of a book
		const allTags = book.reviews.reduce((acc, review) => {
			return [...acc, ...review.hashtags]
		}, [])

		// Unique values of tag array
		const uniqueTags = [...new Set(allTags)]

		// Get top 10 tags
		book.topTags = uniqueTags
		.map((tag) => {
			// Traverse the set of tags of the book and map it to pairs of tag's name and its number of occurrence in array of all tags of the book.
			return {
				name: tag,
				occurrence: allTags.filter((_tag) => _tag === tag).length,
			}
		})
		.sort((a, b) => b.occurrence - a.occurrence)
		.slice(0, 9)
		.map((tag) => tag.name)

		await book.save()
	})
})
