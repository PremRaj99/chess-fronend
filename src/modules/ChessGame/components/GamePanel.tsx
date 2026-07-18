import { RotateCcw, Swords, Crown, Handshake, Clock, ScrollText } from 'lucide-react';
import type { Color } from 'chess.js';

interface GamePanelProps {
  turn: Color;
  moveHistory: string[];
  isGameOver: boolean;
  gameOverReason: string | null;
  winner: 'white' | 'black' | 'draw' | null;
  onResetGame: () => void;
}

function TurnBadge({ turn, isGameOver }: { turn: Color; isGameOver: boolean }) {
  if (isGameOver) return null;

  const isWhite = turn === 'w';
  return (
    <div className="flex items-center gap-2.5 rounded-lg bg-neutral-800/60 px-4 py-3">
      <div
        className={`size-3.5 rounded-full ring-2 ring-offset-1 ring-offset-neutral-900 transition-colors ${
          isWhite ? 'bg-white ring-white/40' : 'bg-neutral-400 ring-neutral-500/40'
        }`}
      />
      <span className="text-sm font-semibold tracking-wide text-neutral-200">
        {isWhite ? 'White' : 'Black'} to move
      </span>
    </div>
  );
}

function GameStatusBadge({
  isGameOver,
  gameOverReason,
  winner,
}: {
  isGameOver: boolean;
  gameOverReason: string | null;
  winner: 'white' | 'black' | 'draw' | null;
}) {
  if (!isGameOver) return null;

  const isDraw = winner === 'draw';

  return (
    <div
      className={`flex items-center gap-2.5 rounded-lg px-4 py-3 ${
        isDraw
          ? 'bg-amber-900/30 ring-1 ring-amber-700/30'
          : 'bg-emerald-900/30 ring-1 ring-emerald-700/30'
      }`}
    >
      {isDraw ? (
        <Handshake className="size-4 text-amber-400" />
      ) : (
        <Crown className="size-4 text-emerald-400" />
      )}
      <div className="flex flex-col">
        <span className={`text-sm font-semibold ${isDraw ? 'text-amber-300' : 'text-emerald-300'}`}>
          {isDraw ? 'Draw' : `${winner === 'white' ? 'White' : 'Black'} wins`}
        </span>
        {gameOverReason && <span className="text-xs text-neutral-400">{gameOverReason}</span>}
      </div>
    </div>
  );
}

function MoveHistory({ moves }: { moves: string[] }) {
  // Pair moves into full-move entries (white + black)
  const movePairs: { number: number; white: string; black?: string }[] = [];
  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push({
      number: Math.floor(i / 2) + 1,
      white: moves[i],
      black: moves[i + 1],
    });
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-lg bg-neutral-900/60 ring-1 ring-neutral-800/50">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-neutral-800/50 px-4 py-2.5">
        <ScrollText className="size-3.5 text-neutral-500" />
        <span className="text-xs font-semibold tracking-widest text-neutral-500 uppercase">
          Moves
        </span>
        {moves.length > 0 && (
          <span className="ml-auto rounded-full bg-neutral-800 px-2 py-0.5 text-[10px] font-medium text-neutral-400">
            {moves.length}
          </span>
        )}
      </div>

      {/* Move list */}
      <div className="custom-scrollbar flex-1 overflow-y-auto px-2 py-2">
        {movePairs.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-neutral-600">
            <Swords className="size-5" />
            <span className="text-xs">No moves yet</span>
          </div>
        ) : (
          <div className="grid grid-cols-[auto_1fr_1fr] gap-x-1 gap-y-0.5">
            {movePairs.map((pair) => (
              <>
                <span
                  key={`n-${pair.number}`}
                  className="pr-1 text-right text-xs text-neutral-600 tabular-nums"
                >
                  {pair.number}.
                </span>
                <span
                  key={`w-${pair.number}`}
                  className="cursor-default rounded px-2 py-0.5 text-xs font-medium text-neutral-300 transition-colors hover:bg-neutral-800/60"
                >
                  {pair.white}
                </span>
                <span
                  key={`b-${pair.number}`}
                  className="cursor-default rounded px-2 py-0.5 text-xs font-medium text-neutral-400 transition-colors hover:bg-neutral-800/60"
                >
                  {pair.black ?? ''}
                </span>
              </>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function GamePanel({
  turn,
  moveHistory,
  isGameOver,
  gameOverReason,
  winner,
  onResetGame,
}: GamePanelProps) {
  return (
    <div className="flex h-full w-full flex-col gap-3 md:w-64">
      {/* Game status or turn indicator */}
      <GameStatusBadge isGameOver={isGameOver} gameOverReason={gameOverReason} winner={winner} />
      <TurnBadge turn={turn} isGameOver={isGameOver} />

      {/* Move history (fills remaining space) */}
      <MoveHistory moves={moveHistory} />

      {/* Game info */}
      <div className="flex items-center gap-2 rounded-lg bg-neutral-900/40 px-4 py-2.5">
        <Clock className="size-3.5 text-neutral-600" />
        <span className="text-xs text-neutral-500">
          {moveHistory.length > 0
            ? `Move ${Math.ceil(moveHistory.length / 2)}`
            : 'Game not started'}
        </span>
      </div>

      {/* Controls */}
      <button
        onClick={onResetGame}
        className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-neutral-800 px-4 py-2.5 text-sm font-medium text-neutral-300 ring-1 ring-neutral-700/50 transition-all hover:bg-neutral-700 hover:text-white hover:ring-neutral-600/50 active:scale-[0.97]"
      >
        <RotateCcw className="size-4 transition-transform group-hover:-rotate-90" />
        New Game
      </button>
    </div>
  );
}
