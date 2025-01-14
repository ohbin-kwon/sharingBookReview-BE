import express from 'express'
import { Follow, Review, User } from '../models/index.js'
import authMiddleware from '../middleware/auth_middleware.js'

const router = new express.Router()

router.get('/', authMiddleware(false), async (req, res, next) => {
	const SCROLL_SIZE = 10
	const userId = res.locals.user?._id
	const { lastItemId } = req.query

	try {
		let reviews
		let result

		if (!lastItemId) {
			reviews = await Review.find()
				.sort('-created_at')
				.limit(SCROLL_SIZE)
				.populate({ path: 'user', select: '_id profileImage nickname' })
				.populate({ path: 'book', select: '_id title author' })
		} else {
			reviews = await Review.find()
				.sort('-created_at')
				.where('_id')
				.lt(lastItemId)
				.limit(SCROLL_SIZE)
				.populate({ path: 'user', select: '_id profileImage nickname' })
				.populate({ path: 'book', select: '_id title author' })
		}

		if (userId) {
			result = reviews.map((review) =>
				Review.processLikesInfo(review, userId)
			)
            result = await Promise.all(
				result.map((review) =>
					Review.bookmarkInfo(review, userId)
				)
			)
			result = await Promise.all(
				result.map((review) =>
					Follow.checkFollowing(review, userId, review.user)
				)
			)
		} else {
			result = reviews
		}
		return res.json(result)
	} catch (e) {
		console.error(e)
		return next(new Error('피드 불러오기를 실패했습니다.'))
	}

	// const userId = 'temp' //todo 로그인 안 된 상태에서 어떻게 처리할지 정해야함
	// try {
	// 	const reviews = await Review.find({}).populate('book user').sort('-created_at')
	//
	// 	const result = reviews.map(review => Review.processLikesInfo(review, userId))
	// 	return res.json(result)
	//
	// } catch (err) {
	// 	return next(new Error('피드를 불러오는데 실패했습니다.'))
	// }
})

/**
 * Route patching read reviews
 * @name patch/:reviewId
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.patch('/:reviewId', authMiddleware(true), async (req, res, next) => {
	const { _id: userId } = res.locals.user
	/** @type {ObjectId}
	 * @description Review ID that user has read.
	 */
	const { reviewId } = req.params

	/** @type {Date}
	 * @description Created date of review.     */
	const createdAt = (await Review.findById(reviewId)).created_at

	// Find user by ID and push to read_reviews array.
	try {
		const user = await User.findById(userId)
		user.read_reviews.addToSet({
			_id: reviewId,
			created_at: createdAt,
		})
		await user.save()

		return res.sendStatus(204)
	} catch (e) {
		console.error(e)
		return next(new Error('읽음 확인을 실패했습니다.'))
	}
})

export default router
