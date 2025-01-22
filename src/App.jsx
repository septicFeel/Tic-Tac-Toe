import React, { useState } from 'react';
import './App.css';

function Square({ value, onClick }) {
  return (
    <button className="square" onClick={onClick}>
      {value}
    </button>
  );
}

function Board({ onGameEnd }) {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [gameStatus, setGameStatus] = useState("");

  function handleClick(index) {
    if (squares[index] || calculateWinner(squares)) return;

    const nextSquares = squares.slice();
    nextSquares[index] = isXNext ? 'X' : 'O';
    setSquares(nextSquares);
    setIsXNext(!isXNext);

    const winner = calculateWinner(nextSquares);
    if (winner) {
      onGameEnd(winner);
      setTimeout(() => resetGame(), 2000);
    } else if (nextSquares.every(square => square !== null)) {
      setGameStatus("Game is a Tie");
      onGameEnd(null);
      setTimeout(() => resetGame(), 2000);
    }
  }

  function resetGame() {
    setSquares(Array(9).fill(null));
    setIsXNext(true);
    setGameStatus("");
  }

  const winner = calculateWinner(squares);
  const status = winner
    ? `Winner: ${winner}`
    : gameStatus || `Next player: ${isXNext ? 'X' : 'O'}`;

  function renderSquare(index) {
    return (
      <Square 
        value={squares[index]} 
        onClick={() => handleClick(index)} 
      />
    );
  }

  return (
    <div>
      <div className="status">{status}</div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      <button className="reset-button" onClick={resetGame}>Reset Game</button>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default function App() {
  const [scores, setScores] = useState({ X: 0, O: 0, gamesPlayed: 0, ties: 0 });

  function handleGameEnd(winner) {
    if (winner) {
      setScores(prevScores => ({
        ...prevScores,
        [winner]: prevScores[winner] + 1,
        gamesPlayed: prevScores.gamesPlayed + 1,
      }));
    } else {
      setScores(prevScores => ({
        ...prevScores,
        ties: prevScores.ties + 1,
        gamesPlayed: prevScores.gamesPlayed + 1,
      }));
    }
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board onGameEnd={handleGameEnd} />
      </div>
      <div className="score-table">
        <h2>Score Table</h2>
        <p>Games Played: {scores.gamesPlayed}</p>
        <p>X Wins: {scores.X}</p>
        <p>O Wins: {scores.O}</p>
        <p>Ties: {scores.ties}</p>
      </div>
    </div>
  );
}