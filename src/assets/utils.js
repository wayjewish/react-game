import cardsData from './cards';

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function secondsToTime(secs) {
  const hours = Math.floor(secs / (60 * 60));

  const divisorForMinutes = secs % (60 * 60);
  let minutes = Math.floor(divisorForMinutes / 60);

  const divisorForSeconds = divisorForMinutes % 60;
  let seconds = Math.ceil(divisorForSeconds);

  if (minutes < 10) minutes = `0${minutes}`;
  if (seconds < 10) seconds = `0${seconds}`;

  const obj = {
    h: hours,
    m: minutes,
    s: seconds,
  };

  return `${obj.m}:${obj.s}`;
}

function saveLS(name, obj) {
  localStorage.setItem(name, JSON.stringify(obj));
}

function getLS(name) {
  return JSON.parse(localStorage.getItem(name));
}

function removeLS(name) {
  localStorage.removeItem(name);
}

function generateCards(count, type) {
  const cards = shuffleArray(cardsData[type])
    .slice(0, count / 2);

  const cards2 = cards.concat(cards)
    .map((item, index) => ({
      id: index,
      code: item.id,
      img: `../../public/${type}/${item.img}`,
      isFlip: false,
      isGuess: false,
    }));

  return shuffleArray(cards2);
}

function generateAudio(arr, volume) {
  const arrRes = {};

  arr.forEach((item) => {
    arrRes[item.name] = new Audio(`../../public/sound/${item.audio}`);
    arrRes[item.name].volume = volume;
  });

  return arrRes;
}

export {
  shuffleArray,
  sleep,
  secondsToTime,
  saveLS,
  getLS,
  removeLS,
  generateCards,
  generateAudio,
};
