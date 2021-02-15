import fs from 'fs'
import {getConnection} from 'typeorm'
import {WhiteCard} from '../card/models/WhiteCard'


async function addWhiteCardsToDb() {
	try {
		getConnection()
		fs.readFile('./src/scripts/cards.json', 'utf-8', (err, rawData) => {
			const cards = JSON.parse(rawData.toString()).white
			Object.keys(cards).forEach( async key => {
				const text = cards[key].content
				const existingCard = await WhiteCard.findOne({text: text})
				if(!existingCard) {
					const card = new WhiteCard()
					card.text = cards[key].content
					card.save()
				}
			})
		})
	} catch(err) {
		console.error(err)
	}
}
export default addWhiteCardsToDb