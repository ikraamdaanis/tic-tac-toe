const gameboard = (() => {
  const gameboardEl = document.querySelector('#gameboardEl')
  const message = document.querySelector('.message')
  const winningScores = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  let scoreboard = ['', '', '', '', '', '', '', '', '']
  let player = 'X'

  const restartGame = () => {
    scoreboard = ['', '', '', '', '', '', '', '', '']
    endGame.classList.remove('end')
    gameboardEl.classList.remove('over')
    message.textContent = ''
  }

  const createGame = () => {
    gameboardEl.innerHTML = ''
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement('div')
      cell.classList.add('cell')
      cell.setAttribute('data-index', i)
      cell.textContent = scoreboard[i]
      gameboardEl.appendChild(cell)
    }
    gameboardEl.style.opacity = '1'
  }

  const swapPlayer = () => {
    player = player === 'X' ? 'O' : 'X'
  }

  const playerMove = (event, againstAi) => {
    if (checkWinner()) return
    const index = event.target.dataset.index

    if (scoreboard[index]) return

    if (againstAi) {
      player = 'O'
    }

    scoreboard[index] = player
    event.target.textContent = player

    if (againstAi) bestMove()
    if (!againstAi) swapPlayer()

    createGame()
    const winner = checkWinner()

    if (winner && winner !== 'tie') {
      endGame.classList.add('end')
      gameboardEl.classList.add('over')
      message.textContent = `${winner} is the winner!`
    }

    if (winner === 'tie') {
      endGame.classList.add('end')
      gameboardEl.classList.add('over')
      message.textContent = 'Draw!'
    }
  }

  const checkWinner = () => {
    let winner = null

    winningScores.forEach(win => {
      if (scoreboard[win[0]] === 'X' && scoreboard[win[1]] === 'X' && scoreboard[win[2]] === 'X') {
        winner = 'X'
      } else if (
        scoreboard[win[0]] === 'O' &&
        scoreboard[win[1]] === 'O' &&
        scoreboard[win[2]] === 'O'
      ) {
        winner = 'O'
      }
    })

    let openSpots = 0
    for (let i = 0; i < 9; i++) {
      if (scoreboard[i] === '') {
        openSpots++
      }
    }

    if (winner == null && openSpots === 0) return 'tie'

    return winner
  }

  function bestMove() {
    let bestScore = -Infinity
    let move

    for (let i = 0; i < scoreboard.length; i++) {
      if (scoreboard[i] === '') {
        scoreboard[i] = 'X'
        let score = minimax(scoreboard, 0, false)
        scoreboard[i] = ''
        if (score > bestScore) {
          bestScore = score
          move = i
        }
      }
    }

    scoreboard[move] = 'X'
  }

  let scores = {
    X: 10,
    O: -10,
    tie: 0,
  }

  function minimax(board, depth, isMaximizing) {
    let result = checkWinner()
    if (result !== null) return scores[result]

    if (isMaximizing) {
      let bestScore = -Infinity
      for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
          board[i] = 'X'
          let score = minimax(board, depth + 1, false)
          board[i] = ''
          bestScore = Math.max(score, bestScore)
        }
      }
      return bestScore
    } else {
      let bestScore = Infinity
      for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
          board[i] = 'O'
          let score = minimax(board, depth + 1, true)
          board[i] = ''
          bestScore = Math.min(score, bestScore)
        }
      }
      return bestScore
    }
  }

  const mainMenu = document.querySelector('.main-menu')
  const endGame = document.querySelector('.end-game')
  const restartBtn = document.querySelector('#restartBtn')
  const humanBtn = document.querySelector('#human')
  const aiBtn = document.querySelector('#ai')

  return {
    createGame,
    playerMove,
    mainMenu,
    humanBtn,
    aiBtn,
    gameboardEl,
    bestMove,
    restartBtn,
    restartGame,
  }
})()

gameboard.humanBtn.onclick = () => {
  gameboard.mainMenu.classList.add('started')
  gameboard.createGame()
  gameboard.gameboardEl.onclick = event => gameboard.playerMove(event, false)
}

gameboard.aiBtn.onclick = () => {
  gameboard.mainMenu.classList.add('started')
  gameboard.bestMove()
  gameboard.createGame()
  gameboard.gameboardEl.onclick = event => gameboard.playerMove(event, true)
}

gameboard.restartBtn.onclick = () => {
  gameboard.restartGame()
  gameboard.mainMenu.classList.remove('started')
  gameboardEl.style.opacity = '0'
}
