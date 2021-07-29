import axios from 'axios'

const searchBooks = async (target,query,client_id, client_secret) => {
    console.log(target, query,client_id,client_secret)
    const api_url = "https://openapi.naver.com/v1/search/book.json?query=" + query
        let result = await axios({
            method: 'get',
            url : api_url,

            headers: {
                "X-Naver-Client-Id": client_id,
                "X-Naver-Client-Secret": client_secret
            }
        })
        
        const resultData = result.data
        const resultMessage = result.data.message

        console.log(resultMessage)
        return resultData

}

export default searchBooks
