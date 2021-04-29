import fs from 'fs'

async function getCardsArrayFromJson(type: 'black' | 'white'): Promise<any[]> {
  return new Promise(resolve => {
    fs.readFile('./src/scripts/cards.json', 'utf-8', (err, rawData) => {
      resolve(JSON.parse(rawData.toString())[type])
    })
  })
}

export async function addCardsToDb(type: 'black' | 'white'): Promise<string> {
  const cards = await getCardsArrayFromJson(type)
  const keys = Object.keys(cards)
  let sql = `INSERT INTO ${type}_card (deck, text) VALUES`
  let values = ''
  for(let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (!key) continue
    // @ts-ignore
    const jsonCard = cards[key]
    if (!values) {
      values = `('yobots', '${jsonCard.content}')`
    } else {
      values += `,('yobots', '${jsonCard.content}')`
    }
  }
  return sql + values
}
