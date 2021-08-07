import jwt from "jsonwebtoken";
import { User } from '../models/index.js'
import passport from "passport";
import { Strategy } from "passport-kakao";
import dotenv from 'dotenv'

dotenv.config()

const kakaoPassportConfig = () => {

    passport.use(
		new Strategy(
			{
				clientID: process.env.KAKAO_CLIENT_ID,
				clientSecret: '',
				callbackURL: 'http://13.124.63.103/api/users/kakao/callback',
			},
			async (_, __, profile, done) => {
				const providerKey = profile.id
				const provider = profile.provider

				let user = await User.findOne({ provider, providerKey })

				if (!user) {
					user = await User.create({ provider, providerKey })
				}

				const token = jwt.sign(
					{ userId: user._id, nickname: user.nickname },
					process.env.TOKEN_KEY
				)

				return done(null, user, token)
			}
		)
	)
}
export default kakaoPassportConfig ;