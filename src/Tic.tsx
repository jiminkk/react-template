import { useCallback, useEffect, useState } from "react";
import useSyncState from "./useSyncState";

/*
board: {
  "0-0": {
    row: 0,
    col: 0
  },
  ...
}
*/
/*
OR
board: [[null, null, null],[null, null, null],[null, null, null]]
*/
type Cell = "X" | "O" | null;
const SIZE = 3;

const initializeBoard = (): Cell[][] => {
  const board = Array.from({ length: SIZE }, () =>
    Array<Cell>(SIZE).fill(null),
  );

  return board;
};

export const TicTacToe = () => {
  const [board, setBoard] = useSyncState<Cell[][]>(
    initializeBoard,
    "tictactoe",
  );
  const [player, setPlayer] = useSyncState<Cell>("O", "player");
  const [closeGame, setCloseGame] = useSyncState<boolean>(false, "gameClosed");

  const toggleMove = (row: number, col: number) => {
    setBoard((prevBoard) => {
      const newBoard = prevBoard.map((r, rowIdx) => {
        if (rowIdx === row) {
          return r.map((val, colIdx) => (colIdx === col ? player : val));
        }
        return r;
      });

      const gameWin = checkWin(newBoard);
      if (gameWin === false) setPlayer((prev) => (prev === "O" ? "X" : "O"));

      return newBoard;
    });
  };

  const checkWin = (newBoard: Cell[][]) => {
    // get all lines (in array) to check for win
    const rows = [...newBoard];
    const cols = [...newBoard.map((v, idx) => newBoard.map((row) => row[idx]))];
    const diagonalOne = newBoard.map((row, idx) => row[idx]);
    const diagonalTwo = newBoard.map((row, idx) => row[SIZE - idx - 1]);
    const lines = [...rows, ...cols, diagonalOne, diagonalTwo];

    if (
      lines.find((row) => row.every((cell) => cell !== null && cell === row[0]))
    ) {
      alert(`Player ${player} wins!`);
      setCloseGame(true);
      return true;
    }
    return false;
  };

  return (
    <div className="grid p-1">
      <h2 className="italic underline mb-2">TicTacToe</h2>
      {closeGame ? (
        <div>
          <p>player {player} wins!</p>
        </div>
      ) : (
        <div>current player: {player}</div>
      )}
      {board.map((rowCells, row) => (
        <div key={`${row}-row`} className="flex">
          {rowCells.map((cell, col) => (
            <input
              key={`${row}-${col}`}
              type="checkbox"
              value={cell ?? ""}
              onClick={() => toggleMove(row, col)}
              className="w-12 h-7 border flex items-center justify-center font-bold text-xs transition-colors
                after:content-[attr(value)] appearance-none"
              disabled={closeGame}
            />
          ))}
        </div>
      ))}
      <div className="mt-2 inline">
        <button
          onClick={() => {
            setBoard(initializeBoard);
            setCloseGame(false);
          }}
          className="outline px-1 text-sm"
        >
          clear game
        </button>
      </div>
    </div>
  );
};
