import { useMemo } from 'react';
import type { PieceSymbol, Color } from 'chess.js';
import ChessBoard from './components/ChessBoard';
import UserTimer from './components/UserTimer';
import PromotionModal from './components/PromotionModal';
import GameOverOverlay from './components/GameOverOverlay';
import GamePanel from './components/GamePanel';
import { useChessGame } from './hooks/useChessGame';

// Starting piece counts for each side
const INITIAL_PIECES: Record<PieceSymbol, number> = {
  p: 8,
  r: 2,
  n: 2,
  b: 2,
  q: 1,
  k: 0,
};
const PIECE_VALUES: Record<PieceSymbol, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0,
};
const PIECE_ORDER: PieceSymbol[] = ['q', 'r', 'b', 'n', 'p'];

function getCapturedPieces(board: ReturnType<typeof useChessGame>['board']) {
  const remaining: Record<Color, Record<PieceSymbol, number>> = {
    w: { p: 0, r: 0, n: 0, b: 0, q: 0, k: 0 },
    b: { p: 0, r: 0, n: 0, b: 0, q: 0, k: 0 },
  };
  for (const row of board) {
    for (const cell of row) {
      if (cell) remaining[cell.color][cell.type]++;
    }
  }

  const capturedByWhite: { type: PieceSymbol; color: Color }[] = [];
  const capturedByBlack: { type: PieceSymbol; color: Color }[] = [];

  for (const pt of PIECE_ORDER) {
    for (let i = 0; i < INITIAL_PIECES[pt] - remaining.b[pt]; i++)
      capturedByWhite.push({ type: pt, color: 'b' });
    for (let i = 0; i < INITIAL_PIECES[pt] - remaining.w[pt]; i++)
      capturedByBlack.push({ type: pt, color: 'w' });
  }

  let advantage = 0;
  for (const pt of PIECE_ORDER) advantage += (remaining.w[pt] - remaining.b[pt]) * PIECE_VALUES[pt];

  return { capturedByWhite, capturedByBlack, materialAdvantage: advantage };
}

export default function ChessGame() {
  const game = useChessGame();

  const { capturedByWhite, capturedByBlack, materialAdvantage } = useMemo(
    () => getCapturedPieces(game.board),
    [game.board],
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 p-4">
      <div className="flex flex-col items-center gap-6 md:flex-row md:items-stretch">
        {/* Board column */}
        <div className="flex w-full max-w-lg flex-col gap-3">
          {/* Black timer (top) — shows white pieces it captured */}
          <UserTimer
            name="Black"
            timeRemaining={game.blackTime}
            isActive={game.turn === 'b' && !game.isGameOver}
            capturedPieces={capturedByBlack}
            materialAdvantage={materialAdvantage < 0 ? Math.abs(materialAdvantage) : 0}
          />

          {/* Board container */}
          <div className="relative">
            <ChessBoard
              board={game.board}
              turn={game.turn}
              selectedSquare={game.selectedSquare}
              legalMoves={game.legalMoves}
              lastMove={game.lastMove}
              kingInCheck={game.kingInCheck}
              handleSquareClick={game.handleSquareClick}
              handleDrop={game.handleDrop}
            />

            {/* Game over overlay */}
            {game.isGameOver && (
              <GameOverOverlay
                winner={game.winner}
                reason={game.gameOverReason}
                onNewGame={game.resetGame}
              />
            )}
          </div>

          {/* White timer (bottom) — shows black pieces it captured */}
          <UserTimer
            name="White"
            timeRemaining={game.whiteTime}
            isActive={game.turn === 'w' && !game.isGameOver}
            capturedPieces={capturedByWhite}
            materialAdvantage={materialAdvantage > 0 ? materialAdvantage : 0}
          />
        </div>

        {/* Side panel */}
        <GamePanel
          turn={game.turn}
          moveHistory={game.moveHistory}
          isGameOver={game.isGameOver}
          gameOverReason={game.gameOverReason}
          winner={game.winner}
          onResetGame={game.resetGame}
        />
      </div>

      {/* Promotion modal */}
      {game.pendingPromotion && (
        <PromotionModal color={game.turn} onSelect={game.handlePromotion} />
      )}
    </div>
  );
}
