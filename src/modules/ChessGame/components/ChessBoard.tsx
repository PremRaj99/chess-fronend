import { cn } from '@/lib/utils';
import type { Square } from 'chess.js';
import { useRef, type DragEvent } from 'react';
import Pieces from './PiecesSVG';
import type { GameState, GameActions } from '../hooks/useChessGame';

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = [8, 7, 6, 5, 4, 3, 2, 1]; // Top to bottom, White at bottom

function getSquare(rank: number, file: string): Square {
  return `${file}${rank}` as Square;
}

function isLightSquare(file: string, rank: number): boolean {
  const fileIndex = file.charCodeAt(0) - 'a'.charCodeAt(0);
  return (fileIndex + rank) % 2 !== 0;
}

type ChessBoardProps = Pick<
  GameState,
  'board' | 'turn' | 'selectedSquare' | 'legalMoves' | 'lastMove' | 'kingInCheck'
> &
  Pick<GameActions, 'handleSquareClick' | 'handleDrop'>;

export default function ChessBoard({
  board,
  turn,
  selectedSquare,
  legalMoves,
  lastMove,
  kingInCheck,
  handleSquareClick,
  handleDrop,
}: ChessBoardProps) {
  const dragSourceRef = useRef<Square | null>(null);

  const onDragStart = (e: DragEvent<HTMLDivElement>, square: Square) => {
    const boardRow = 8 - parseInt(square[1]);
    const boardCol = square.charCodeAt(0) - 'a'.charCodeAt(0);
    const piece = board[boardRow][boardCol];

    // Only allow dragging the current player's pieces
    if (!piece || piece.color !== turn) {
      e.preventDefault();
      return;
    }

    dragSourceRef.current = square;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', square);

    // Select the piece so legal moves show while dragging
    handleSquareClick(square);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (e: DragEvent<HTMLDivElement>, targetSquare: Square) => {
    e.preventDefault();
    const from = dragSourceRef.current;
    if (from && from !== targetSquare) {
      handleDrop(from, targetSquare);
    }
    dragSourceRef.current = null;
  };

  const onDragEnd = () => {
    dragSourceRef.current = null;
  };

  return (
    <div className="relative select-none">
      <div className="grid grid-cols-8 overflow-hidden rounded-lg border-2 border-neutral-700 shadow-xl">
        {RANKS.map((rank, rankIdx) =>
          FILES.map((file, fileIdx) => {
            const square = getSquare(rank, file);
            const light = isLightSquare(file, rank);
            const isSelected = selectedSquare === square;
            const isLegalMove = legalMoves.includes(square);
            const isLastMoveSquare =
              lastMove && (lastMove.from === square || lastMove.to === square);
            const isCheck = kingInCheck === square;

            // board[0] = rank 8, board[7] = rank 1
            const boardRow = 8 - rank;
            const boardCol = fileIdx;
            const piece = board[boardRow][boardCol];
            const hasPiece = piece !== null;
            const isDraggable = hasPiece && piece.color === turn;

            return (
              <div
                key={square}
                onClick={() => handleSquareClick(square)}
                onDragOver={onDragOver}
                onDrop={(e) => onDrop(e, square)}
                className={cn(
                  'relative flex aspect-square cursor-pointer items-center justify-center p-[6px] transition-colors',
                  // Base square colors
                  light ? 'bg-[#EBECD0]' : 'bg-[#779556]',
                  // Selected square highlight
                  isSelected && (light ? 'bg-[#F6F682]' : 'bg-[#BBCC44]'),
                  // Last move highlight
                  isLastMoveSquare &&
                    !isSelected &&
                    (light ? 'bg-[#F6F682]/70' : 'bg-[#BBCC44]/70'),
                  // King in check
                  isCheck && 'bg-red-500/80',
                )}
              >
                {/* Rank label on the left edge (file a) */}
                {fileIdx === 0 && (
                  <span
                    className={cn(
                      'absolute top-0.5 left-1 text-[10px] font-bold select-none',
                      light ? 'text-[#779556]' : 'text-[#EBECD0]',
                    )}
                  >
                    {rank}
                  </span>
                )}

                {/* File label on the bottom edge (rank 1) */}
                {rankIdx === 7 && (
                  <span
                    className={cn(
                      'absolute right-1 bottom-0.5 text-[10px] font-bold select-none',
                      light ? 'text-[#779556]' : 'text-[#EBECD0]',
                    )}
                  >
                    {file}
                  </span>
                )}

                {/* Piece (draggable) */}
                {hasPiece && (
                  <div
                    draggable={isDraggable}
                    onDragStart={(e) => onDragStart(e, square)}
                    onDragEnd={onDragEnd}
                    className={cn(
                      'flex size-full items-center justify-center',
                      isDraggable && 'cursor-grab active:cursor-grabbing',
                    )}
                  >
                    <Pieces type={piece.type} color={piece.color} />
                  </div>
                )}

                {/* Legal move indicator */}
                {isLegalMove && !hasPiece && (
                  <div className="absolute size-[28%] rounded-full bg-black/20" />
                )}
                {isLegalMove && hasPiece && (
                  <div className="absolute inset-0 rounded-sm ring-[3px] ring-black/20 ring-inset" />
                )}
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}
