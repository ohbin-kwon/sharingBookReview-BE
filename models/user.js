import mongoose from 'mongoose'
import expList from '../exp_list.js'

const userSchema = new mongoose.Schema({
	nickname: {
		type: String,
	},
	providerKey: {
		type: String,
	},
	provider: {
		type: String,
		enum: ['naver','kakao','google']
	},
    level:{
        type: Number,
        default: 1
    },
    exp: {
        type: Number,
        default: 0
    }
}
)

// todo 발생되는 event의 target instance id과 event를 수행하는 user id를 저장해서 level과 exp를 virtual로 표현
// why 누가 어디에 event를 실행했는지를 저장하는것이 확장성이 높다.
userSchema.statics.getExpAndLevelUp = async function(userId, event) {
    const user = await this.findById(userId)
    user.exp += expList[event]
    let requiredExp = 3 * (1.05**(user.level - 1))

    if(user.exp >= requiredExp){
        user.level += 1
        user.exp -= requiredExp
}
        await user.save()

        return user
}

for(const path in userSchema.paths) {
	if (path === '_id') continue
	// const property = userSchema.paths[path]
	// property.required(true)
}

export default mongoose.model('User', userSchema)