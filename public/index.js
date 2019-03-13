const Utils = (() => {
  removeEl = el => el.parentNode.removeChild(el) // move this method to Game class

  updateToggleButton = (button, label, classToAdd, classToRemove) => {
    button.innerHTML = label
    button.classList.add(classToAdd)
    button.classList.remove(classToRemove)
  }
  return Object.freeze({
    removeEl,
    updateToggleButton
  })
})()

class Dot {
  MIN_SIZE = 10
  MAX_SIZE = 100
  GRADIENT_TYPE = 'radial-gradient'
  GRADIENTS = [
    '(#f26080, #ed2f59, #f2073b)', // red
    '(#95bcf9, #4b89ed, #0960ed)', // blue
    '(#68e863, #3aa536, #047201)', // green
    '(#d387ed, #9e3dbf, #680e87)', // violet
    '(#f9e086, #f4c829, #f9c300)', // yellow
  ]
  constructor(getSpeed) {
   const maxWidth = window.innerWidth - this.MAX_SIZE
    const dotSize = this.getRandomDotSize()
    const dotValue = this.getDotValue(dotSize)
    const dotLeftPosition = this.getRandomNum(0, maxWidth)
    const topPosition = 0 - dotSize - getSpeed()
    this.dot = document.createElement('div')

    this.dot.setAttribute('class', 'dot')
    this.dot.setAttribute('data-size', dotSize)
    this.dot.setAttribute('data-value', dotValue)
    this.dot.style.width = `${dotSize}px`
    this.dot.style.height = `${dotSize}px`
    this.dot.style.top = topPosition + 'px'
    this.dot.style.left = dotLeftPosition + 'px'
    this.dot.style['background-image'] = this.getRandomGradient()
  }
  getDotValue = diameter => 11 - diameter * 0.1

  getRandomDotSize = () =>
    Math.round((Math.random() * (this.MAX_SIZE - this.MIN_SIZE) + this.MIN_SIZE) / 10) * 10

  getRandomNum = (min, max) => Math.floor(Math.random() * (max - min)) + min

  getRandomGradient = () => {
    return (
      this.GRADIENT_TYPE +
      this.GRADIENTS[Math.floor(Math.random() * this.GRADIENTS.length)]
    )
  }

  createDot() {
    return this.dot
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
    const dot = new Dot(this.getSpeed).createDot()
    dot.addEventListener('click', this.dotOnClick)
    playground.appendChild(dot)

  }
  dotOnClick = event => {
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
