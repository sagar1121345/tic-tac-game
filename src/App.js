import { useState } from "react";
let dimension = 5;
sdfsd
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (isWInner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winner = isWInner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else if (squares.every((sqValue) => !!sqValue)) {
    status = "Match is draw.";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const renderSquarePad = () => {
    let rows = [];
    for (let i = 0; i < dimension; i++) {
      let squaresInRow = [];
      for (let j = 0; j < dimension; j++) {
        squaresInRow.push(
          <Square
            value={squares[i * dimension + j]}
            onSquareClick={() => handleClick(i * dimension + j)}
          />
        );
      }
      rows.push(
        <div className="board-row" key={i}>
          {squaresInRow}
        </div>
      );
    }
    return rows;
  };

  return (
    <>
      <div className="status">{status}</div>
      {renderSquarePad()}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([
    Array(dimension * dimension).fill(null),
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }


  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />;
      </div>
    </div>
  );
}

function isWInner(squares) {
  const lines = [];

  for (let row = 0; row < dimension; row++) {
    lines.push(
      Array.from(new Array(dimension).keys()).map(
        (num) => row * dimension + num
      )
    );
  }

  for (let col = 0; col < dimension; col++) {
    lines.push(
      Array.from(new Array(dimension).keys()).map(
        (num) => num * dimension + col
      )
    );
  }

  lines.push(
    Array.from(new Array(dimension).keys()).map((num) => num * dimension + num)
  );
  lines.push(
    Array.from(new Array(dimension).keys()).map(
      (num) => num * dimension + (dimension - num - 1)
    )
  );

  for (let line of lines) {
    const [first, second, ...restElement] = line;

    if (
      squares[first] &&
      squares[first] === squares[second] &&
      restElement.every((i) => squares[i] === squares[first])
    ) {
      return squares[first];
    }
  }
  return null;
}
