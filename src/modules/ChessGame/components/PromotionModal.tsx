import type { PieceSymbol, Color } from 'chess.js';
import Pieces from './PiecesSVG';

const PROMOTION_PIECES: PieceSymbol[] = ['q', 'r', 'b', 'n'];

export default function PromotionModal({
  color,
  onSelect,
}: {
  color: Color;
  onSelect: (piece: PieceSymbol) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="rounded-2xl border border-neutral-700 bg-neutral-900 p-6 shadow-2xl">
        <h3 className="mb-4 text-center text-lg font-semibold text-white">Promote Pawn</h3>
        <div className="flex gap-3">
          {PROMOTION_PIECES.map((piece) => (
            <button
              key={piece}
              onClick={() => onSelect(piece)}
              className="flex size-16 cursor-pointer items-center justify-center rounded-xl border-2 border-neutral-700 bg-neutral-800 p-2 transition-all hover:scale-110 hover:border-green-500 hover:bg-neutral-700"
            >
              <Pieces type={piece} color={color} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
