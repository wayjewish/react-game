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

export {
  shuffleArray,
  sleep,
  secondsToTime,
};
