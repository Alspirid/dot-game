function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

class Dot {
  constructor(getSpeed) {
    _defineProperty(this, "MIN_SIZE", 10);
    _defineProperty(this, "MAX_SIZE", 100);
    _defineProperty(this, "GRADIENT_TYPE", "radial-gradient");
    _defineProperty(this, "GRADIENTS", [
      "(#f26080, #ed2f59, #f2073b)", // red
      "(#95bcf9, #4b89ed, #0960ed)", // blue
      "(#68e863, #3aa536, #047201)", // green
      "(#d387ed, #9e3dbf, #680e87)", // violet
      "(#f9e086, #f4c829, #f9c300)", // yellow
    ]);

    _defineProperty(this, "getDotValue", (diameter) => 11 - diameter * 0.1);

    _defineProperty(
      this,
      "getRandomDotSize",
      () =>
        Math.round(
          (Math.random() * (this.MAX_SIZE - this.MIN_SIZE) + this.MIN_SIZE) / 10
        ) * 10
    );

    _defineProperty(
      this,
      "getRandomNum",
      (min, max) => Math.floor(Math.random() * (max - min)) + min
    );

    _defineProperty(this, "getRandomGradient", () => {
      return (
        this.GRADIENT_TYPE +
        this.GRADIENTS[Math.floor(Math.random() * this.GRADIENTS.length)]
      );
    });

    const maxWidth = window.innerWidth - this.MAX_SIZE;
    const dotSize = this.getRandomDotSize();
    const dotValue = this.getDotValue(dotSize);
    const dotLeftPosition = this.getRandomNum(0, maxWidth);
    const topPosition = 0 - dotSize - getSpeed();
    this.dot = document.createElement("div");
    this.dot.setAttribute("class", "dot");
    this.dot.setAttribute("data-size", dotSize);
    this.dot.setAttribute("data-value", dotValue);
    this.dot.style.width = `${dotSize}px`;
    this.dot.style.height = `${dotSize}px`;
    this.dot.style.top = topPosition + "px";
    this.dot.style.left = dotLeftPosition + "px";
    this.dot.style["background-image"] = this.getRandomGradient();
  }

  createDot() {
    return this.dot;
  }
}

class Game {
  constructor() {
    _defineProperty(this, "state", {
      score: 0,
      isRunning: false,
      intervalId: null,
      intervalOfMoving: null,
      refreshRate: 1000,
      scoreElement: document.getElementById("score"),
      gameBtn: document.getElementById("game-btn"),
      speedElement: document.getElementById("speed"),
      speedLabel: document.getElementById("speed-label"),
      controlElement: document.getElementById("controls"),
    });

    _defineProperty(this, "setState", (obj) => {
      this.state = { ...this.state, ...obj };
    });

    _defineProperty(this, "getMovingRefreshRate", () =>
      Math.floor(this.state.refreshRate / this.getSpeed())
    );

    _defineProperty(this, "getSpeed", () =>
      parseInt(this.state.speedElement.value, 10)
    );

    _defineProperty(this, "setSpeed", () => {
      const { speedLabel } = this.state;
      speedLabel.innerHTML = `Speed: ${this.getSpeed()}`;
    });

    _defineProperty(this, "togglePlay", () => {
      let {
        gameBtn,
        isRunning,
        refreshRate,
        movingRefreshRate,
        intervalId,
        intervalOfMoving,
        controlElement,
      } = this.state;

      if (isRunning) {
        this.updateToggleButton(gameBtn, "Start", "start", "pause");
        controlElement.classList.add("paused");
        this.setState({
          isRunning: false,
        });
        clearInterval(intervalId);
        clearInterval(intervalOfMoving);
      } else {
        this.updateToggleButton(gameBtn, "Pause", "pause", "start");
        controlElement.classList.remove("paused");
        this.setState({
          isRunning: true,
          intervalId: setInterval(this.addDot, refreshRate),
          intervalOfMoving: setInterval(
            this.animateDots,
            this.getMovingRefreshRate()
          ),
        });
      }
    });

    _defineProperty(this, "addDot", () => {
      const dot = new Dot(this.getSpeed).createDot();
      dot.addEventListener("click", this.dotOnClick);
      playground.appendChild(dot);
    });

    _defineProperty(this, "deleteDot", (dot) =>
      dot.parentNode.removeChild(dot)
    );

    _defineProperty(this, "dotOnClick", (event) => {
      const { target } = event;
      const { isRunning } = this.state;
      const dotValue = parseInt(target.getAttribute("data-value"), 10);
      const dotWidth = target.getAttribute("data-size");

      if (isRunning) {
        setTimeout(() => {
          this.setScore(dotValue);
          this.deleteDot(target);
        }, 0);
      }
    });

    _defineProperty(this, "setScore", (value) => {
      let { score, scoreElement } = this.state;
      const updatedScore = score + value;
      this.setState({
        score: updatedScore,
      });
      scoreElement.innerHTML = `Score: ${updatedScore}`;
    });

    _defineProperty(this, "animateDots", () => {
      const playgroundHeight = document.getElementById("playground")
        .offsetHeight;
      document.querySelectorAll(".dot").forEach((dot) => {
        const positionY = parseInt(dot.style.top, 10),
          shift = positionY + 1;
        if (positionY > playgroundHeight) this.deleteDot(dot);
        dot.style.top = `${shift}px`;
      });
    });

    _defineProperty(
      this,
      "updateToggleButton",
      (button, label, classToAdd, classToRemove) => {
        button.innerHTML = label;
        button.classList.add(classToAdd);
        button.classList.remove(classToRemove);
      }
    );

    let { gameBtn: _gameBtn, speedElement } = this.state;
    this.setScore(0);
    this.setSpeed();

    _gameBtn.addEventListener("click", this.togglePlay);

    speedElement.addEventListener("change", () => {
      const { intervalOfMoving } = this.state;
      this.setSpeed();
      clearInterval(intervalOfMoving);

      if (this.state.isRunning) {
        const interval = setInterval(
          this.animateDots,
          this.getMovingRefreshRate()
        );
        this.setState({
          intervalOfMoving: interval,
        });
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", () => new Game());
