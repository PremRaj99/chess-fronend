import type { Piece } from 'chess.js';

export const WhiteKing = () => (
  <>
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Chess_klt45.svg/1280px-Chess_klt45.svg.png"
      alt="klt"
    />
  </>
);

export const BlackKing = () => (
  <>
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Chess_kdt45.svg/1280px-Chess_kdt45.svg.png"
      alt="kdt"
    />
  </>
);

export const BlackQueen = () => (
  <>
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Chess_qdt45.svg/1280px-Chess_qdt45.svg.png"
      alt="qdt"
    />
  </>
);

export const WhiteQueen = () => (
  <>
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Chess_qlt45.svg/1280px-Chess_qlt45.svg.png"
      alt="qlt"
    />
  </>
);

export const BlackRook = () => (
  <>
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Chess_rdt45.svg/1280px-Chess_rdt45.svg.png"
      alt="rdt"
    />
  </>
);

export const WhiteRook = () => (
  <>
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Chess_rlt45.svg/1280px-Chess_rlt45.svg.png"
      alt="rlt"
    />
  </>
);

export const BlackBishop = () => (
  <>
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Chess_bdt45.svg/1280px-Chess_bdt45.svg.png"
      alt="bdt"
    />
  </>
);

export const WhiteBishop = () => (
  <>
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Chess_blt45.svg/1280px-Chess_blt45.svg.png"
      alt="blt"
    />
  </>
);
export const BlackKnight = () => (
  <>
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Chess_ndt45.svg/1280px-Chess_ndt45.svg.png"
      alt="ndt"
    />
  </>
);

export const WhiteKnight = () => (
  <>
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Chess_nlt45.svg/1280px-Chess_nlt45.svg.png"
      alt="nlt"
    />
  </>
);

export const BlackPawn = () => (
  <>
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Chess_pdt45.svg/1280px-Chess_pdt45.svg.png"
      alt="pdt"
    />
  </>
);

export const WhitePawn = () => (
  <>
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Chess_plt45.svg/1280px-Chess_plt45.svg.png"
      alt="plt"
    />
  </>
);

export default function Pieces({ type, color }: Piece) {
  switch (color) {
    case 'w':
      switch (type) {
        case 'k':
          return <WhiteKing />;
        case 'q':
          return <WhiteQueen />;
        case 'r':
          return <WhiteRook />;
        case 'b':
          return <WhiteBishop />;
        case 'n':
          return <WhiteKnight />;
        case 'p':
          return <WhitePawn />;
      }
      break;
    case 'b':
      switch (type) {
        case 'k':
          return <BlackKing />;
        case 'q':
          return <BlackQueen />;
        case 'r':
          return <BlackRook />;
        case 'b':
          return <BlackBishop />;
        case 'n':
          return <BlackKnight />;
        case 'p':
          return <BlackPawn />;
      }
      break;
  }
}
