import fs from 'fs'

function addWhiteCardsToDb() {
	const rawData = fs.readFileSync('./cards.json')
	const cards = JOSN.parse(rawData)
	const cardContents = []
	for(let i; i <= 375; i++) {
		cardContents.push(cards[i].content)
	}
	
}