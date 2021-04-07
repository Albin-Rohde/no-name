const shuffle = (arr: Array<any>): Array<any> => {
  return arr.length ? arr.splice(~~(Math.random()*arr.length),1).concat(shuffle(arr)) : arr
}

export default shuffle