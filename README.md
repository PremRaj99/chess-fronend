# ♟️ Modern Chess Frontend

A sleek, responsive, and feature-rich interactive Chess web application built with **React 19**, **TypeScript**, **Tailwind CSS v4**, and **chess.js**.

---

## ✨ Features

- 🎯 **Flexible Controls**: Play by dragging & dropping pieces or clicking squares with legal move indicators.
- ⏱️ **Countdown Timers**: Independent 10-minute rapid clock for both White and Black with active turn highlights.
- 🏆 **Captured Pieces & Material Advantage**: Real-time captured piece displays integrated into each player's panel alongside a live material score difference (`+N`).
- 📜 **Move History Panel**: Scrollable log of all played moves formatted in standard algebraic notation (SAN).
- 👑 **Endgame & Promotion Handling**: Automatic detection of Checkmate, Stalemate, Draw (threefold repetition, 50-move rule, insufficient material), and Timeout with modal pawn promotion choices.
- 🛠️ **Developer Experience & Tooling**: Pre-configured with **ESLint**, **Prettier**, **TypeScript**, and **Husky** pre-commit hooks for automated code formatting and typechecking.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Chess Engine / Validation**: [chess.js](https://github.com/jhlywa/chess.js)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Code Quality**: [Husky](https://typicode.github.io/husky/), [lint-staged](https://github.com/lint-staged/lint-staged), [ESLint](https://eslint.org/), [Prettier](https://prettier.io/)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20.0.0 or higher recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd chess-fronend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the Vite development server with Hot Module Replacement (HMR). |
| `npm run build` | Runs TypeScript check (`tsc -b`) and builds production assets into `dist`. |
| `npm run preview` | Previews the production build locally. |
| `npm run lint` | Lints code using ESLint. |
| `npm run format` | Formats all code using Prettier. |
| `npm run typecheck` | Runs TypeScript type checker without emitting files. |
| `npm run prepare` | Initializes Husky git hooks. |

---

## 📁 Project Structure

```text
src/
├── lib/               # Utility functions (clsx, tailwind-merge)
└── modules/
    └── ChessGame/     # Main Chess module
        ├── components/
        │   ├── ChessBoard.tsx      # Interactive 8x8 chessboard
        │   ├── GameOverOverlay.tsx # Overlay displayed on game end
        │   ├── GamePanel.tsx       # Move history, game status & actions
        │   ├── PiecesSVG.tsx       # Piece rendering logic
        │   ├── PromotionModal.tsx  # Pawn promotion selection popup
        │   ├── Timer.tsx           # Formatted countdown display
        │   └── UserTimer.tsx      # Player avatar, timer & captured pieces
        ├── hooks/
        │   └── useChessGame.ts     # Game state management & chess.js wrapper
        └── index.tsx              # Main Chess Game layout view
```
