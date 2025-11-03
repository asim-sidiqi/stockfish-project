import express from "express";
import cors from "cors";
import Stockfish from "stockfish";

const app = express();
app.use(cors());
app.use(express.json());

const engine = Stockfish();
engine.onmessage = (event) => console.log("Engine:", event);

app.post("/api/bestmove", async (req, res) => {
  const { fen } = req.body;
  if (!fen) return res.status(400).json({ error: "No FEN provided" });

  let bestMove = "";

  engine.postMessage("uci");
  engine.postMessage(`position fen ${fen}`);
  engine.postMessage("go depth 15");

  engine.onmessage = (line) => {
    if (typeof line === "string" && line.startsWith("bestmove")) {
      bestMove = line.split(" ")[1];
      res.json({ bestMove });
    }
  };
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
