import fs from 'fs'
import {getConnection} from 'typeorm'
import {PlayerCard} from '../card/models/PlayerCard'


async function addWhiteCardsToDb() {
	try {
		getConnection()
		fs.readFile('./src/scripts/cards.json', 'utf-8', (err, rawData) => {
			const cards = JSON.parse(rawData.toString()).white
			Object.keys(cards).forEach( async key => {
				const text = cards[key].content
				const existingCard = await PlayerCard.findOne({text: text})
				if(!existingCard) {
					const card = new PlayerCard()
					card.text = cards[key].content
					card.save()
				}
			})
		})
	} catch(err) {
		console.error(err)
	}
}

addWhiteCardsToDb()