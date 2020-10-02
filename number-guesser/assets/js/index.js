;(document => {
  const $ = v => document.getElementById(v)

  const ui = {
    input: $('guess-input'),
    btn: $('guess-btn'),
    container: $('container'),
    getNotifications() {
      return [...document.querySelectorAll('.notification')]
    },
  }

  const store = {
    playState: 'pre',
    winningNum: null,
    currentGuess: null,
    triesRemaining: null,
  }

  function cleanUp() {
    store.playState = 'pre'
    ui.input.disabled = true
    ui.btn.innerText = 'Play again'
  }

  function notify({ text, time, won }) {
    ui.input.classList.add(`${won ? 'green' : 'red'}`)
    const div = document.createElement('div')
    div.classList.add('notification', `${won ? 'green' : 'red'}`)
    div.innerHTML = `<span>${text}</span>`
    ui.container.appendChild(div)
    setTimeout(() => {
      ui.input.classList.remove('green', 'red')
      return div ? div.remove() : null
    }, time * 1000)
  }

  function check() {
    store.currentGuess = +ui.input.value
    ui.input.value = ''
    store.triesRemaining--
    return store.currentGuess === store.winningNum
  }

  const removeHandler = () =>
    ui.btn.removeEventListener('click', this.flowControl)

  function turn({ text, state }) {
    notify({
      text,
      time: state.next ? 4 : 8,
      won: state.won,
    })
    if (state.done) {
      removeHandler()
      cleanUp()
    } else {
      ui.input.focus()
    }
  }

  function flowControl() {
    const match = check()
    if (match && store.triesRemaining >= 0) {
      turn({
        text: `Congratulations! You guessed ${store.currentGuess} & it was correct.`,
        state: { done: true, next: false, won: true },
      })
      return
    }
    if (!match && store.triesRemaining > 0) {
      turn({
        text: `Sorry! ${store.currentGuess} was incorrect. You have ${store.triesRemaining} tries remaining.`,
        state: { done: false, next: true, won: false },
      })
      return
    }
    if (store.triesRemaining === 0) {
      turn({
        text: `Oh dear! Sadly, your guess of ${store.currentGuess} was way off. The number was ${store.winningNum}. Better luck next time!`,
        state: { done: true, next: false, won: false },
      })
      return
    }
  }

  function play(event) {
    event.preventDefault()
    if (store.playState === 'pre') {
      ui.getNotifications().forEach(el => el.remove())
      ui.input.classList.remove('red', 'green')
      ui.btn.innerText = 'Guess'
      store.winningNum = Math.floor(Math.random() * 9) + 1
      store.triesRemaining = 3
      ui.input.disabled = false
      ui.input.focus()
      store.playState = 'playing'
      return
    }
    if (store.playState === 'playing') {
      ui.getNotifications().forEach(el => el.remove())
      ui.input.classList.remove('red', 'green')
      flowControl()
      return
    }
  }

  ui.input.disabled = true
  ui.btn.onclick = play
})(document)
