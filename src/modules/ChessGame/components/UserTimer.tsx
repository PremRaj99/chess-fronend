import { UserIcon } from 'lucide-react';
import type { PieceSymbol, Color } from 'chess.js';
import Timer from './Timer';
import Pieces from './PiecesSVG';

interface CapturedPiece {
  type: PieceSymbol;
  color: Color;
}

export default function UserTimer({
  name,
  timeRemaining,
  isActive,
  capturedPieces = [],
  materialAdvantage = 0,
}: {
  name: string;
  timeRemaining: number;
  isActive: boolean;
  capturedPieces?: CapturedPiece[];
  materialAdvantage?: number;
}) {
  return (
    <div
      className={`flex flex-col gap-1 rounded-lg px-4 py-3 transition-all ${
        isActive ? 'bg-neutral-800 shadow-lg shadow-green-900/20' : 'bg-neutral-900'
      }`}
    >
      {/* Top row: name + timer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`flex size-8 items-center justify-center rounded-full ${
              isActive ? 'bg-green-700' : 'bg-neutral-700'
            }`}
          >
            <UserIcon className="size-4 text-white" />
          </div>
          <div className="flex flex-col items-start gap-2">
            <span className={`text-xs font-medium ${isActive ? 'text-white' : 'text-neutral-500'}`}>
              {name}
            </span>
            {/* Captured pieces row */}
            {capturedPieces.length > 0 && (
              <div className="flex items-center gap-0.5 rounded-md bg-gray-700/50 px-1.5 py-0.5">
                {capturedPieces.map((piece, i) => (
                  <div key={`cap-${i}`} className="-mx-0.5 size-4 opacity-75">
                    <Pieces type={piece.type} color={piece.color} />
                  </div>
                ))}
                {materialAdvantage > 0 && (
                  <span className="ml-1 text-[11px] font-bold text-emerald-400">
                    +{materialAdvantage}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        <Timer timeRemaining={timeRemaining} isActive={isActive} />
      </div>
    </div>
  );
}
