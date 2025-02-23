import { Book } from '../models/index.js'
import { getBookDescription } from './crawl.js'

/**
 * Saves book search result into DB.
 * @param {Object} searchResult Search result from naver dev api.
 * @returns {Promise<Document<any, any, unknown>>} book document
 */
const saveBook = async (searchResult) => {
	const newBook = new Book()
	/**
	 * Fix search result's format into DB's format
	 */
	for (const [key, value] of Object.entries(searchResult)) {
        if (key === 'description'){
	        newBook[key] = await getBookDescription(searchResult.link)
        }else{
            newBook[key] = value
        }
		
	}
	return await newBook.save()
}

export default saveBook
