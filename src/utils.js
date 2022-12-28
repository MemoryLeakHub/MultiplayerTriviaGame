export const getRandomItemFromArray = (items) => { 
   return items[Math.floor(Math.random()*items.length)];
}  

export const removeItem = (arr, value) => {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
}

export const getRandomNElementsFromArray = (array, n) => {
    const shuffled = array.sort(() => 0.5 - Math.random());
    let selected = shuffled.slice(0, n);
    return selected
}

export const randomIntFromInterval = (min, max) => { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}
