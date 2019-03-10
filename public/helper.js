function calcDotValue(diameter) {
  return 11 - (diameter * 0.1);
}

function getRandomNum(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomNum10(min, max) {
  return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function removeEl(el) {
  el.parentNode.removeChild(el);
}
