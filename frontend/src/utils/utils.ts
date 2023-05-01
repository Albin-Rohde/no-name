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