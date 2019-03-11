class Utils {
  static calcDotValue = diameter => 11 - diameter * 0.1

  static getRandomNum = (min, max) =>
    Math.floor(Math.random() * (max - min)) + min

  static getRandomNum10 = (min, max) =>
    Math.round((Math.random() * (max - min) + min) / 10) * 10

  static removeEl = el => el.parentNode.removeChild(el)
  
  static updateToggleButton = (button, label, classToAdd, classToRemove) => {
    button.innerHTML = label
    button.classList.add(classToAdd)
    button.classList.remove(classToRemove)
  }
}

class Gradient {
  static GRADIENT_TYPE = 'radial-gradient'
  static GRADIENTS = [
    '(#f26080, #ed2f59, #f2073b)', // red
    '(#95bcf9, #4b89ed, #0960ed)', // blue
    '(#68e863, #3aa536, #047201)', // green
    '(#d387ed, #9e3dbf, #680e87)', // violet
    '(#f9e086, #f4c829, #f9c300)', // yellow
  ]
  static getRandomGradient = () => {
    return this.GRADIENT_TYPE + this.GRADIENTS[Math.floor(Math.random() * this.GRADIENTS.length)]
  }
}

class Game {
  state = {
    score: 0,
    isRunning: false,
    interval: 0,
    timer: 1000,
    scoreDiv: document.getElementById('score'),
    gameBtn: document.getElementById('game-btn'),
    speedDiv: document.getElementById('speed'),
    speedLabel: document.getElementById('speed-label'),
  }

  setState = obj => {
    this.state = {...this.state, ...obj}
  }

  init = () => {
    let {startingScore, gameBtn, speedDiv} = this.state
    this.setScore(0)
    this.setSpeed()
    gameBtn.addEventListener('click', this.togglePlay)
    speedDiv.addEventListener('change', this.setSpeed)
  }

  getSpeed = () => parseInt(this.state.speedDiv.value, 10)

  setSpeed = () => {
    const {speedLabel} = this.state
    speedLabel.innerHTML = `Speed: ${this.getSpeed()}`
  }
  togglePlay = () => {
    let {gameBtn, isRunning, timer, interval} = this.state
    if (isRunning) {
      Utils.updateToggleButton(gameBtn, 'Start', 'start', 'pause')
      this.setState({isRunning: false})
      clearInterval(interval)
    } else {
      Utils.updateToggleButton(gameBtn, 'Pause', 'pause', 'start')
      this.setState({
        isRunning: true,
        interval: setInterval(this.play, timer),
      })
    }
  }
  play = () => {
    this.addDot()
    this.animateDots()
  }
  addDot = () => {
    // const {colors} = this.state
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
    span.style['background-image'] = Gradient.getRandomGradient()
      
    span.addEventListener('click', this.dotClicked)
    playground.appendChild(span)
  }
  dotClicked = event => {
    const {target} = event
    const {isRunning} = this.state
    const dotValue = parseInt(target.getAttribute('data-value'), 10)
    const dotWidth = target.getAttribute('data-size')
    if (isRunning) {
      setTimeout(() => {
        this.setScore(dotValue)
        Utils.removeEl(target)
      }, 0)
    }
  }
  setScore = value => {
    let {score, scoreDiv} = this.state
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
