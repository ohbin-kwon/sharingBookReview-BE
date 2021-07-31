import express from 'express'
import Book from '../models/book.js'
import Review from '../models/review.js'
import saveBooks from './controllers/savebooks.js'
import searchBooks from './controllers/searchbooks.js'

const router = new express.Router({ mergeParams: true })

router.post('/', async (req, res, next) => {
    const { bookId } = req.params
    // const { userId } = req.locals.user   
    const { quote, content, hashtags, image } = req.body

	try {
		const searchList = await searchBooks('isbn', bookId)
		saveBooks(searchList[0], bookId)
		const review = new Review({
			// userId,
			bookId,
			quote,
			content,
			hashtags,
			image,
		})
		await review.save()
		await Book.findByIdAndUpdate(
			bookId,
			{ $push: { reviews: review._id } }
		)

		return res.sendStatus(201)
	} catch (e) {
    	console.error(e)
		return next(new Error('리뷰 작성을 실패했습니다.'))
	}
})

router.get('/', async (req, res) => {
	const { bookId } = req.params

    const reviewList = await Review.findById({ bookId })
    
	return res.json({reviewList})
})

router.get('/:reviewId', async (req, res) => {
    const { bookId, reviewId } = req.params

    const review = await Review.findById( reviewId )
    
	return res.json({ review })
})

router.put('/:reviewId', async (req, res) => {
    const { bookId, reviewId } = req.params
    const { quote, content, hashtags, image } = req.body
    
    await Review.findByIdAndUpdate(
        reviewId ,
        { quote, content, hashtags, image }
        )

	return res.sendStatus(202)
})

router.delete('/:reviewId', async (req, res) => {
	const { bookId, reviewId } = req.params

	await Review.findByIdAndDelete(reviewId)

	return res.sendStatus(202)
})

router.put('/:reviewId/like', (req, res) => {
	return res.sendStatus(201)
})

export default router