import React, { useState } from "react";
import "../styles/ChessAnalyzer.css";

export default function ChessAnalyzer() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [bestMove, setBestMove] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) return;

    setLoading(true);
    setBestMove("");

    // Simulate Stockfish API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // 🔹 Random valid chess moves
    const possibleMoves = [
      "d2d4","d1e2",
    ];

    const randomMove =
      possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

    setBestMove(`Best move: ${randomMove}`);
    setLoading(false);
  };

  return (
    <div className="ca-page">
      <h1 className="ca-title">Chess Move Analyzer</h1>

      <div className="ca-card">
        <form className="ca-form" onSubmit={handleSubmit}>
          <label htmlFor="fileInput" className="ca-drop">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="Chessboard Preview"
                className="ca-preview"
              />
            ) : (
              <div className="ca-placeholder">
                <p>Upload Chessboard Image</p>
                <p>(PNG, JPG, JPEG)</p>
              </div>
            )}
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="ca-file"
            />
          </label>

          <div className="ca-actions">
            <button
              type="submit"
              className="ca-btn ca-btn-primary"
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Analyze Move"}
            </button>
          </div>
        </form>

        {bestMove && (
          <div className="ca-result">
            <div className="ca-row">
              <span className="ca-label">Best Move</span>
              <span className="ca-value">{bestMove}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
