import { RotateCcw } from 'lucide-react';

export default function GameOverOverlay({
  winner,
  reason,
  onNewGame,
}: {
  winner: 'white' | 'black' | 'draw' | null;
  reason: string | null;
  onNewGame: () => void;
}) {
  const resultText =
    winner === 'draw' ? 'Draw!' : winner === 'white' ? 'White Wins!' : 'Black Wins!';

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center rounded-lg bg-black/70 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-neutral-700 bg-neutral-900 px-10 py-8 shadow-2xl">
        <h2 className="text-3xl font-bold text-white">{resultText}</h2>
        {reason && <p className="text-lg text-neutral-400">{reason}</p>}
        <button
          onClick={onNewGame}
          className="mt-2 flex cursor-pointer items-center gap-2 rounded-lg bg-green-700 px-6 py-3 font-semibold text-white transition-all hover:bg-green-600 active:scale-95"
        >
          <RotateCcw className="size-5" />
          New Game
        </button>
      </div>
    </div>
  );
}
