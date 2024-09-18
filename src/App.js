import './App.css';
import { useCallback, useEffect, useState } from 'react';


function App() {
  const [sizeRow, setSizeRow] = useState(3);
  const [sizeCol, setSizeCol] = useState(3);
  const [grid, setGrid] = useState(Array(sizeRow).fill(null).map(() => Array(sizeCol).fill('')));
  const [currentPlayer, setCurrentPlayer] = useState('1');
  const [winner, setWinner] = useState(null);
  const [character, setCharacter] = useState('S');

  useEffect(() => {
    document.title = 'SOS Game';
  }, []);

const checkForWin = useCallback((grid) => {
  const numRows = grid.length;
  const numCols = grid[0].length;

  const checkLineForSOS = (line) => {
    for (let i = 0; i <= line.length - 3; i++) {
      if (line[i] === 'S' && line[i + 1] === 'O' && line[i + 2] === 'S') {
        return true;
      }
    }
    return false;
  };

  // Check rows and columns
  for (let i = 0; i < numRows; i++) {
    // Check row
    if (checkLineForSOS(grid[i])) {
      return true;
    }

    // Check column
    const column = [];
    for (let j = 0; j < numCols; j++) {
      column.push(grid[j][i]);
    }
    if (checkLineForSOS(column)) {
      return true;
    }
  }

  // Check top-left to bottom-right diagonals
  for (let i = 0; i <= numRows - 3; i++) {
    for (let j = 0; j <= numCols - 3; j++) {
      let diag1 = [];
      for (let k = 0; k < Math.min(numRows - i, numCols - j); k++) {
        diag1.push(grid[i + k][j + k]);
      }
      if (checkLineForSOS(diag1)) {
        return true;
      }
    }
  }

  // Check top-right to bottom-left diagonals
  for (let i = 0; i <= numRows - 3; i++) {
    for (let j = 2; j < numCols; j++) {
      let diag2 = [];
      for (let k = 0; k < Math.min(numRows - i, j + 1); k++) {
        diag2.push(grid[i + k][j - k]);
      }
      if (checkLineForSOS(diag2)) {
        return true;
      }
    }
  }

  return false;
}, []);

  const handleClick = useCallback ((row, col) => {
    if (grid[row][col] !== '' || winner) return;

    const newGrid = grid.map((r, i) => 
      i === row ? r.map((cell, j) => (j === col ? character: cell)) : r
    );
    setGrid(newGrid);

    if (checkForWin(newGrid)) {
      setWinner(currentPlayer);
    } else {
      setCurrentPlayer(currentPlayer === '1' ? '2' : '1');
    }
  }, [grid, winner, character, currentPlayer, checkForWin]);

  const renderGrid = useCallback( () => {
    return grid.map((row, rowIndex) => (
      <div key={rowIndex} className="row">
        {row.map((cell, colIndex) => (
          <div
            key={colIndex}
            className="cell"
            onClick={() => handleClick(rowIndex, colIndex)}
          >
            {cell}
          </div>
        ))}
      </div>
    ));
  }, [grid, handleClick])

  const reset = (sizeRow, sizeCol) => {
    setGrid(Array(parseInt(sizeRow)).fill(null).map(() => Array(parseInt(sizeCol)).fill('')));
    setWinner(null);
    setCurrentPlayer('1');
  }


  useEffect(() => {
    renderGrid()
  }, [grid, renderGrid])

  return (
    <div className="App">
      <h1>SOS Game</h1>
      <span>
        <span>{"Size: "}</span>
        <input type="number" value={sizeRow} onChange={(e) => setSizeRow(e.target.value)} style={{width: '50px', margin: '5px'}} />
        <span>{"x"}</span>
        <input type="number" value={sizeCol} onChange={(e) => setSizeCol(e.target.value)} style={{width: '50px', margin: '5px'}}/>
        <button onClick={() => reset(sizeRow, sizeCol)} style={{marginLeft: '10px'}}>Reset</button>
      </span>
      <h2>Current Player: {currentPlayer}</h2>
      {winner && <h2>Winner: {winner}</h2>}
      <div className="grid">
        {renderGrid()}
      </div>
      <div>
        <div>Character: {character}</div>
        <button onClick={() => setCharacter(character === 'S' ? 'O' : 'S')}>change</button>
      </div>
    </div>
  );
}

export default App;
