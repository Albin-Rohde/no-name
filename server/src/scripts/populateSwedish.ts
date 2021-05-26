import fs from 'fs'

async function getCardsArrayFromJson(type: 'white_verb' | 'white_noun' | 'white_definite' | 'black'): Promise<any[]> {
  return new Promise(resolve => {
    fs.readFile('./src/scripts/swedish_yobotics_01.json', 'utf-8', (err, rawData) => {
      resolve(JSON.parse(rawData.toString())[type])
    })
  })
}

export async function addCardsToDb(type: 'white_verb' | 'white_noun' | 'white_definite' | 'black'): Promise<string> {
  const cards = await getCardsArrayFromJson(type)
  const table = type.startsWith('white') ? 'white_card' : 'black_card'

  let sql;
  if (table === 'black_card') {
    sql = `INSERT INTO ${table} (deck, text) VALUES`
  } else {
    sql = `INSERT INTO ${table} (deck, text, type) VALUES`
  }
  let values = ''
  for (const card of cards) {
    if (table === 'black_card') {
      if (!values) {
        values = `('yobots_svenska', '${card}')`
      } else {
        values += `,('yobots_svenska', '${card}')`
      }
    } else {
      if (!values) {
        values = `('yobots_svenska', '${card}', '${type.split('_')[1]}')`
      } else {
        values += `,('yobots_svenska', '${card}', '${type.split('_')[1]}')`
      }
    }
  }
  return sql + values
}
