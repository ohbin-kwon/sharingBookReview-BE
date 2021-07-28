import express from 'express'
import usersRouter from './users.js'
import reviewsRouter from './reviews.js'
import commentsRouter from './comments.js'
import booksRouter from './books.js'

const router = express.Router()

router.use('/api/users', usersRouter)
router.use('/api/books/:bookId/reviews/:reviewId/comments', commentsRouter) // temp path
router.use('/api/books/:bookId/reviews', reviewsRouter) // temp path
router.use('/api/books', booksRouter)

export default router
