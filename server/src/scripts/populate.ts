import fs from 'fs'
import {getConnection} from 'typeorm'
import {WhiteCard} from '../card/models/WhiteCard'


async function addWhiteCardsToDb() {
	try {
		getConnection()
		fs.readFile('./src/scripts/cards.json', 'utf-8', async (err, rawData) => {
			const cards = JSON.parse(rawData.toString()).white
			const keys = Object.keys(cards)
			for(let i = 0; i < keys.length; i++) {
				const key = keys[i]
				const text = cards[key].content
				const existingCard = await WhiteCard.findOne({text: text})
				if(!existingCard) {
					const card = new WhiteCard()
					card.text = text
					await card.save()
				}
			}
			console.log('added all cards')
		})
	} catch(err) {
		console.error(err)
	}
}
export default addWhiteCardsToDb