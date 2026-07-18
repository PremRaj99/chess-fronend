import { useState, useCallback, useEffect, useRef } from 'react';
import { Chess, type Square, type PieceSymbol, type Color } from 'chess.js';

export interface GameState {
  board: ReturnType<Chess['board']>;
  turn: Color;
  selectedSquare: Square | null;
  legalMoves: Square[];
  lastMove: { from: Square; to: Square } | null;
  kingInCheck: Square | null;
  whiteTime: number;
  blackTime: number;
  isGameOver: boolean;
  gameOverReason: string | null;
  winner: 'white' | 'black' | 'draw' | null;
  pendingPromotion: { from: Square; to: Square } | null;
  moveHistory: string[];
}

export interface GameActions {
  handleSquareClick: (square: Square) => void;
  handleDrop: (from: Square, to: Square) => void;
  handlePromotion: (piece: PieceSymbol) => void;
  resetGame: () => void;
}

const INITIAL_TIME = 600; // 10 minutes in seconds

function findKingSquare(chess: Chess, color: Color): Square | null {
  const board = chess.board();
  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      const piece = board[rank][file];
      if (piece && piece.type === 'k' && piece.color === color) {
        return piece.square;
      }
    }
  }
  return null;
}

export function useChessGame(): GameState & GameActions {
  const [chess] = useState(() => new Chess());
  const [board, setBoard] = useState(() => chess.board());
  const [turn, setTurn] = useState<Color>(() => chess.turn());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<Square[]>([]);
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);
  const [whiteTime, setWhiteTime] = useState(INITIAL_TIME);
  const [blackTime, setBlackTime] = useState(INITIAL_TIME);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameOverReason, setGameOverReason] = useState<string | null>(null);
  const [winner, setWinner] = useState<'white' | 'black' | 'draw' | null>(null);
  const [pendingPromotion, setPendingPromotion] = useState<{
    from: Square;
    to: Square;
  } | null>(null);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [gameStarted, setGameStarted] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Compute king-in-check square
  const kingInCheck = chess.inCheck() ? findKingSquare(chess, chess.turn()) : null;

  // Sync all state from the chess instance
  const syncState = useCallback(() => {
    setBoard(chess.board());
    setTurn(chess.turn());
    setMoveHistory(chess.history());
  }, [chess]);

  // Check for game-over conditions from chess.js
  const checkGameOver = useCallback(() => {
    if (chess.isGameOver()) {
      setIsGameOver(true);
      if (chess.isCheckmate()) {
        // The side whose turn it is has been checkmated
        const loser = chess.turn();
        setWinner(loser === 'w' ? 'black' : 'white');
        setGameOverReason('Checkmate');
      } else if (chess.isStalemate()) {
        setWinner('draw');
        setGameOverReason('Stalemate');
      } else if (chess.isThreefoldRepetition()) {
        setWinner('draw');
        setGameOverReason('Threefold Repetition');
      } else if (chess.isInsufficientMaterial()) {
        setWinner('draw');
        setGameOverReason('Insufficient Material');
      } else if (chess.isDraw()) {
        setWinner('draw');
        setGameOverReason('Draw (50-move rule)');
      }
      return true;
    }
    return false;
  }, [chess]);

  // Timer logic
  useEffect(() => {
    if (!gameStarted || isGameOver) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      if (turn === 'w') {
        setWhiteTime((prev) => {
          if (prev <= 1) {
            setIsGameOver(true);
            setGameOverReason('Timeout');
            setWinner('black');
            return 0;
          }
          return prev - 1;
        });
      } else {
        setBlackTime((prev) => {
          if (prev <= 1) {
            setIsGameOver(true);
            setGameOverReason('Timeout');
            setWinner('white');
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [turn, gameStarted, isGameOver]);

  // Try to execute a move
  const executeMove = useCallback(
    (from: Square, to: Square, promotion?: PieceSymbol) => {
      try {
        const move = chess.move({ from, to, promotion: promotion || 'q' });
        if (move) {
          if (!gameStarted) setGameStarted(true);
          setLastMove({ from, to });
          setSelectedSquare(null);
          setLegalMoves([]);
          syncState();
          checkGameOver();
          return true;
        }
      } catch {
        // Invalid move
      }
      return false;
    },
    [chess, syncState, checkGameOver, gameStarted],
  );

  // Check if a move would be a promotion
  const isPromotionMove = useCallback(
    (from: Square, to: Square): boolean => {
      const piece = chess.get(from);
      if (!piece || piece.type !== 'p') return false;

      const toRank = to[1];
      if (piece.color === 'w' && toRank === '8') return true;
      if (piece.color === 'b' && toRank === '1') return true;

      return false;
    },
    [chess],
  );

  const handleSquareClick = useCallback(
    (square: Square) => {
      if (isGameOver || pendingPromotion) return;

      const piece = chess.get(square);

      // If we already have a piece selected
      if (selectedSquare) {
        // Clicking the same square deselects
        if (selectedSquare === square) {
          setSelectedSquare(null);
          setLegalMoves([]);
          return;
        }

        // If clicking on own piece, re-select it
        if (piece && piece.color === chess.turn()) {
          setSelectedSquare(square);
          const moves = chess.moves({ square, verbose: true });
          setLegalMoves(moves.map((m) => m.to));
          return;
        }

        // Try to move to this square
        if (legalMoves.includes(square)) {
          // Check for promotion
          if (isPromotionMove(selectedSquare, square)) {
            setPendingPromotion({ from: selectedSquare, to: square });
            return;
          }
          executeMove(selectedSquare, square);
        } else {
          // Invalid target — deselect
          setSelectedSquare(null);
          setLegalMoves([]);
        }
        return;
      }

      // No piece selected yet — select this piece if it's the current player's
      if (piece && piece.color === chess.turn()) {
        setSelectedSquare(square);
        const moves = chess.moves({ square, verbose: true });
        setLegalMoves(moves.map((m) => m.to));
      }
    },
    [chess, selectedSquare, legalMoves, isGameOver, pendingPromotion, executeMove, isPromotionMove],
  );

  const handleDrop = useCallback(
    (from: Square, to: Square) => {
      if (isGameOver || pendingPromotion) return;

      const piece = chess.get(from);
      if (!piece || piece.color !== chess.turn()) return;

      // Validate that this is a legal move
      const moves = chess.moves({ square: from, verbose: true });
      const isLegal = moves.some((m) => m.to === to);
      if (!isLegal) return;

      // Check for promotion
      if (isPromotionMove(from, to)) {
        setPendingPromotion({ from, to });
        setSelectedSquare(null);
        setLegalMoves([]);
        return;
      }

      executeMove(from, to);
    },
    [chess, isGameOver, pendingPromotion, executeMove, isPromotionMove],
  );

  const handlePromotion = useCallback(
    (piece: PieceSymbol) => {
      if (!pendingPromotion) return;
      executeMove(pendingPromotion.from, pendingPromotion.to, piece);
      setPendingPromotion(null);
    },
    [pendingPromotion, executeMove],
  );

  const resetGame = useCallback(() => {
    chess.reset();
    syncState();
    setSelectedSquare(null);
    setLegalMoves([]);
    setLastMove(null);
    setWhiteTime(INITIAL_TIME);
    setBlackTime(INITIAL_TIME);
    setIsGameOver(false);
    setGameOverReason(null);
    setWinner(null);
    setPendingPromotion(null);
    setGameStarted(false);
  }, [chess, syncState]);

  return {
    board,
    turn,
    selectedSquare,
    legalMoves,
    lastMove,
    kingInCheck,
    whiteTime,
    blackTime,
    isGameOver,
    gameOverReason,
    winner,
    pendingPromotion,
    moveHistory,
    handleSquareClick,
    handleDrop,
    handlePromotion,
    resetGame,
  };
}
