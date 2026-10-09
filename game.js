:root {
  --bg1: #07121d;
  --bg2: #0d2240;
  --bg3: #1a2f52;
  --panel: rgba(8, 15, 25, 0.5);
  --text: #eaf6ff;
  --accent: #74f7d5;
  --warning: #ffbf69;
  --danger: #ff6f91;
  --shadow: rgba(0, 0, 0, 0.35);
}

* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  min-height: 100%;
  width: 100%;
  background: linear-gradient(180deg, var(--bg2), var(--bg1));
  color: var(--text);
  font-family: "Segoe UI", Tahoma, sans-serif;
  overflow: hidden;
}

body {
  display: grid;
  place-items: center;
  padding: 12px;
  touch-action: manipulation;
}

.game-shell {
  position: relative;
  width: min(96vw, 960px);
  aspect-ratio: 16 / 9;
  border: 4px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 20px 40px var(--shadow);
  background: var(--panel);
  overflow: hidden;
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
  image-rendering: pixelated;
  background: linear-gradient(180deg, var(--bg3), var(--bg2));
  touch-action: none;
}

.hud {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  gap: 18px;
  padding: 8px 12px;
  border: 2px solid rgba(255, 255, 255, 0.15);
  background: rgba(0, 0, 0, 0.25);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: clamp(10px, 1.6vw, 12px);
}

.message {
  position: absolute;
  inset: auto 0 16px 0;
  margin: auto;
  width: max-content;
  max-width: 90%;
  text-align: center;
  padding: 10px 16px;
  border: 2px solid rgba(255, 255, 255, 0.15);
  background: rgba(7, 18, 29, 0.7);
  box-shadow: 0 10px 20px var(--shadow);
  font-size: clamp(14px, 2vw, 18px);
  line-height: 1.5;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.2s ease, transform 0.2s ease;
  pointer-events: none;
}

.message.visible {
  opacity: 1;
  transform: translateY(0);
}

#jumpButton {
  position: absolute;
  right: 18px;
  bottom: 18px;
  z-index: 10;
  border: 2px solid rgba(255, 255, 255, 0.2);
  background: linear-gradient(180deg, var(--accent), #4fd0b7);
  color: #0b1220;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  min-width: 120px;
  min-height: 54px;
  border-radius: 14px;
  box-shadow: 0 10px 18px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  user-select: none;
}

#jumpButton:active {
  transform: translateY(2px) scale(0.98);
}

strong {
  color: var(--accent);
}

@media (max-width: 540px) {
  body {
    padding: 0;
  }

  .game-shell {
    width: 100vw;
    height: 100vh;
    max-height: 100vh;
    border: none;
  }

  .hud {
    gap: 10px;
    padding: 6px 10px;
  }

  #jumpButton {
    right: 12px;
    bottom: max(12px, env(safe-area-inset-bottom));
    min-width: 96px;
    min-height: 48px;
    font-size: 14px;
  }
}
