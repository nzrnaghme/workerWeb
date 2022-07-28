const maxWordLength = 13;

export function truncateString(str: string, num: number) {
  if (str === null) return "";

  let editedStr = str;
  // const wordsArr = str.split(" ");
  // const longWords = wordsArr.filter((w) => w.length > maxWordLength);

  // for (const word of longWords) {
  //   const shortedWord = word.substring(0, maxWordLength);
  //   editedStr = editedStr.replace(word, shortedWord);
  // }

  if (editedStr.length <= num) {
    return editedStr;
  }

  return editedStr.slice(0, num) + "...";
}
