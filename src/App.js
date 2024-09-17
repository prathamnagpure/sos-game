import './App.css';
import { useCallback, useEffect, useState } from 'react';


function App() {
  const [sizeRow, setSizeRow] = useState(3);
  const [sizeCol, setSizeCol] = useState(3);
  const [grid, setGrid] = useState(Array(sizeRow).fill(null).map(() => Array(sizeCol).fill('')));
  const [currentPlayer, setCurrentPlayer] = useState('1');
  const [winner, setWinner] = useState(null);
  const [character, setCharacter] = useState('S');



  const checkForWin = useCallback((grid) => {
    const lines = [];

    for (let i = 0; i < Math.min(grid[0].length, grid.length); i++) {
      lines.push(grid[i]); // Row
      lines.push(grid.map(row => row[i])); // Column
    }

    lines.push(grid.map((row, i) => row[i])); // Top-left to bottom-right
    lines.push(grid.map((row, i) => row[Math.min(grid.length, grid[0].length) - 1 - i])); // Top-right to bottom-left

    return lines.some(line => {
      for (let i = 0; i <= line.length - 3; i++) {
        if (line[i] === 'S' && line[i+1] === 'O' && line[i+2] === 'S') {
          return true;
        }
      }
      return false;
    });
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
      <h1>SOS Game : (In development)</h1>
      <span>
        <span>{"Size: "}</span>
        <input type="number" value={sizeRow} onChange={(e) => setSizeRow(e.target.value)} />
        <span>{"x"}</span>
        <input type="number" value={sizeCol} onChange={(e) => setSizeCol(e.target.value)} />
        <button onClick={() => reset(sizeRow, sizeCol)}>Reset</button>
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
