export const getFontSize = (
  textLength: number,
  isMobile?: boolean,
  screenHeight?: number,
): string => {
    if (isMobile) {
      let fontSize: number = 1.7
      if (textLength > 40) {
        fontSize = 1.6
      }
      if (textLength > 60) {
        fontSize = 1.5
      }
      if (textLength > 78) {
        fontSize = 1.4;
      }
      if (textLength > 85) {
        fontSize = 1.3;
      }
      if (screenHeight && screenHeight < 675) {
        fontSize = fontSize - 0.3
      }
      if (screenHeight && screenHeight < 600) {
        fontSize = fontSize - 0.2
      }
      return `${fontSize}em`;
    }
    let fontSize = '1.3vw';
    if (textLength > 78) {
      fontSize = '1.2vw';
    }
    if (textLength > 85) {
      fontSize = '1.1vw';
    }
    return fontSize;
  }

export const wrappedCardText = (text: string): string =>  {
  const longWords = text.split(' ').filter((word) => word.length >= 13)
  longWords.forEach((word) => {
    const startOfWord = text.indexOf(word)
    const part1 = text.slice(startOfWord, startOfWord + 13)
    const part2 = text.slice(startOfWord + 13, startOfWord + word.length)
    text = text.replaceAll(word, `${part1}- ${part2}`)
  })
  return text
}