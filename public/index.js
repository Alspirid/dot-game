var startingScore = 0,
    score         = 0,
    isRunning     = false,
    interval      = 0,
    timer         = 1000,
    colors        = ['#556270', '#4ECDC4', '#C7F464', '#FF6B6B', '#C44D58'],
    scoreDiv      = document.getElementById('score'),
    gameBtn       = document.getElementById('game-btn'),
    speedDiv      = document.getElementById('speed'),
    speedLabel    = document.getElementById('speed-label');

function init() {
  setScore(startingScore);
  setSpeed();
  gameBtn.addEventListener('click', toggleGame);
  speedDiv.addEventListener('change', setSpeed);
}

function getSpeed() {
  return parseInt(speedDiv.value, 10);
}

function setSpeed() {
  speedLabel.innerHTML = 'Speed: ' + getSpeed();
}

function toggleGame() {
  if (isRunning) {
    isRunning = false;
    gameBtn.innerHTML = 'Start';
    gameBtn.classList.add('start');
    gameBtn.classList.remove('pause');
    clearInterval(interval);
  } else {
    isRunning = true;
    gameBtn.innerHTML = 'Pause';
    gameBtn.classList.add('pause');
    gameBtn.classList.remove('start');
    interval = setInterval(game, timer);
  }
}

function game() {
  addDot();
  animateDots();
}

function addDot() {
  var playground      = document.getElementById('playground'),
      maxWidth        = window.innerWidth - 100,
      dotSize         = getRandomNum10(10, 100),
      dotValue        = calcDotValue(dotSize),
      dotLeftPosition = getRandomNum(0, maxWidth),
      span            = document.createElement('span'),
      topPosition     = 0 - dotSize - getSpeed();

  span.setAttribute('class', 'dot');
  span.setAttribute('data-size', dotSize);
  span.setAttribute('data-value', dotValue);
  span.style.width = dotSize + 'px';
  span.style.height = dotSize + 'px';
  span.style.top = topPosition  + 'px';
  span.style.left = dotLeftPosition + 'px';
  span.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
  span.addEventListener('click', dotClicked);
  playground.appendChild(span);
}

function dotClicked() {
  var el       = this,
      dotValue = parseInt(el.getAttribute('data-value'), 10),
      dotWidth = el.getAttribute('data-size');

  if (isRunning) {
    setTimeout( function() {
      setScore(dotValue);
      removeEl(el);
    }, 10);
  }
}

function setScore(value) {
  score += value;
  scoreDiv.innerHTML = score;
}

// TODO: Play with frame rate perhaps via requestAnimationFrame ?
function animateDots() {
  var dots             = document.querySelectorAll('.dot'),
      playgroundHeight = document.getElementById('playground').offsetHeight,
      speed            = getSpeed();

  for (var i = 0; i < dots.length; i++) {
    var positionY = parseInt(dots[i].style.top, 10),
        velocity  = positionY += speed;

    if (positionY > playgroundHeight) {
      removeEl(dots[i]);
    }
    dots[i].style.top = velocity + "px";
  }
}

window.onload = function() {
  init();
};
