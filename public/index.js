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
    Math.round(
      (Math.random() * (this.MAX_SIZE - this.MIN_SIZE) + this.MIN_SIZE) / 10,
    ) * 10

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
    intervalId: null,
    intervalOfMoving: null,
    refreshRate: 1000,
    movingRefreshRate: 1000,
    scoreElement: document.getElementById('score'),
    gameBtn: document.getElementById('game-btn'),
    speedElement: document.getElementById('speed'),
    speedLabel: document.getElementById('speed-label'),
  }

  setState = obj => {
    setTimeout(() => {
      this.state = {...this.state, ...obj}
    }, 0)
  }

  constructor() {
    let {startingScore, gameBtn, speedElement} = this.state
    this.setScore(0)
    this.setSpeed()
    gameBtn.addEventListener('click', this.togglePlay)
    speedElement.addEventListener('change', this.setSpeed)
  }

  getSpeed = () => parseInt(this.state.speedElement.value, 10)

  setSpeed = () => {
    const {speedLabel} = this.state
    speedLabel.innerHTML = `Speed: ${this.getSpeed()}`
    this.setState({movingRefreshRate: 1000 / this.getSpeed()})
    console.log(this.state)
  }
  togglePlay = () => {
    let {
      gameBtn,
      isRunning,
      refreshRate,
      movingRefreshRate,
      intervalId,
      intervalOfMoving,
    } = this.state
    if (isRunning) {
      this.updateToggleButton(gameBtn, 'Start', 'start', 'pause')
      this.setState({isRunning: false})
      clearInterval(intervalId)
      clearInterval(intervalOfMoving)
    } else {
      this.updateToggleButton(gameBtn, 'Pause', 'pause', 'start')
      this.setState({
        isRunning: true,
        intervalId: setInterval(this.addDot, refreshRate),
        intervalOfMoving: setInterval(this.animateDots, movingRefreshRate),
      })
    }
  }

  addDot = () => {
    const dot = new Dot(this.getSpeed).createDot()
    dot.addEventListener('click', this.dotOnClick)
    playground.appendChild(dot)
  }
  deleteDot = dot => dot.parentNode.removeChild(dot)

  dotOnClick = event => {
    const {target} = event
    const {isRunning} = this.state
    const dotValue = parseInt(target.getAttribute('data-value'), 10)
    const dotWidth = target.getAttribute('data-size')
    if (isRunning) {
      setTimeout(() => {
        this.setScore(dotValue)
        this.deleteDot(target)
      }, 0)
    }
  }
  setScore = value => {
    let {score, scoreElement} = this.state
    const updatedScore = score + value
    this.setState({score: updatedScore})
    scoreElement.innerHTML = `Your Score: ${updatedScore}`
  }
  animateDots = () => {
    const playgroundHeight = document.getElementById('playground').offsetHeight
    document.querySelectorAll('.dot').forEach(dot => {
      const positionY = parseInt(dot.style.top, 10),
        shift = positionY + 1 //this.getSpeed()
      if (positionY > playgroundHeight) this.deleteDot(dot)
      dot.style.top = `${shift}px`
    })
  }
  updateToggleButton = (button, label, classToAdd, classToRemove) => {
    button.innerHTML = label
    button.classList.add(classToAdd)
    button.classList.remove(classToRemove)
  }
}

document.addEventListener('DOMContentLoaded', () => new Game())
