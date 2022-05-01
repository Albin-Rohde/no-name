export const getFontSize = (textLength: number, isMobile?: boolean): string => {
    if (isMobile) {
      let fontSize = '1.6em';
      if (textLength > 78) {
        fontSize = '1.4em';
      }
      if (textLength > 85) {
        fontSize = '1.3em';
      }
      return fontSize;
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