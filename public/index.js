class Utils {
  static calcDotValue = diameter => 11 - diameter * 0.1

  static getRandomNum = (min, max) =>
    Math.floor(Math.random() * (max - min)) + min

  static getRandomNum10 = (min, max) =>
    Math.round((Math.random() * (max - min) + min) / 10) * 10

  static removeEl = el => el.parentNode.removeChild(el)
}


class Game {

  state = {
      score: 0,
      isRunning: false,
      interval: 0,
      timer: 1000,
      colors: ['#556270', '#4ECDC4', '#C7F464', '#FF6B6B', '#C44D58'],
      scoreDiv: document.getElementById('score'),
      gameBtn: document.getElementById('game-btn'),
      speedDiv: document.getElementById('speed'),
      speedLabel: document.getElementById('speed-label'),
    }

  setState = (obj) => {
    this.state = {...this.state, ...obj}
  }

  init = () => {
    let { startingScore, gameBtn, speedDiv } = this.state
    this.setScore(0)
    this.setSpeed()
    gameBtn.addEventListener('click', this.togglePlay)
    speedDiv.addEventListener('change', this.setSpeed)
  }

  getSpeed = () => {
    const { speedDiv } = this.state
    return parseInt(speedDiv.value, 10)
  }
  setSpeed = () => {
    const { speedLabel } = this.state
    speedLabel.innerHTML = 'Speed: ' + this.getSpeed()
  }
  togglePlay = () => { // rename it to toggle play
    let { gameBtn, isRunning, timer, interval } = this.state
    if (isRunning) {
      this.setState({isRunning: false})
      gameBtn.innerHTML = 'Start'
      gameBtn.classList.add('start')
      gameBtn.classList.remove('pause')
      clearInterval(interval)
    } else {
      gameBtn.innerHTML = 'Pause'
      gameBtn.classList.add('pause')
      gameBtn.classList.remove('start')
      this.setState({
        isRunning: true,
        interval: setInterval(this.play, timer)})
    }
  }
  play = () => {
    this.addDot()
    this.animateDots()
  }
  addDot = () => {
    const { colors } = this.state
    const playground = document.getElementById('playground')
    const maxWidth = window.innerWidth - 100
    const dotSize = Utils.getRandomNum10(10, 100)
    const dotValue = Utils.calcDotValue(dotSize)
    const dotLeftPosition = Utils.getRandomNum(0, maxWidth)
    const span = document.createElement('span')
    const topPosition = 0 - dotSize - this.getSpeed()
  
    span.setAttribute('class', 'dot')
    span.setAttribute('data-size', dotSize)
    span.setAttribute('data-value', dotValue)
    span.style.width = dotSize + 'px'
    span.style.height = dotSize + 'px'
    span.style.top = topPosition + 'px'
    span.style.left = dotLeftPosition + 'px'
    span.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
    span.addEventListener('click', this.dotClicked)
    playground.appendChild(span)
  }
  dotClicked = (event) => {
    const { target } = event
    const { isRunning } = this.state
    const dotValue = parseInt(target.getAttribute('data-value'), 10)
    const dotWidth = target.getAttribute('data-size')
    if (isRunning) {
      setTimeout(() => {
        this.setScore(dotValue)
        Utils.removeEl(target)
      }, 0)
    }
  }
  setScore = (value) => {
    let { score, scoreDiv } = this.state
    const updatedScore = score + value
    this.setState({score: updatedScore})
    scoreDiv.innerHTML = `Your Score: ${updatedScore}`
  }
  animateDots = () => {
    const dots = document.querySelectorAll('.dot')
    const playgroundHeight = document.getElementById('playground').offsetHeight
    const speed = this.getSpeed()
  
    for (let i = 0; i < dots.length; i++) {
      let positionY = parseInt(dots[i].style.top, 10),
        velocity = (positionY += speed)
        if (positionY > playgroundHeight) {
        Utils.removeEl(dots[i])
      }
      dots[i].style.top = velocity + 'px'
    }
  }
}


document.addEventListener('DOMContentLoaded', () => {
  const dotGame = new Game()
  dotGame.init()
})
