import React, { useState } from "react";

export default function ChessAnalyzer() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [bestMove, setBestMove] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [boardSVG, setBoardSVG] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImageFile(file);
      setSelectedImage(URL.createObjectURL(file));
    }
  };


  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!selectedImage) return;

  //   setLoading(true);
  //   setBestMove("");

  //   await new Promise((resolve) => setTimeout(resolve, 1500));

  //   const possibleMoves = ["d2d4", "d1e2"];
  //   const randomMove =
  //     possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

  //   setBestMove(`Best move: ${randomMove}`);
  //   setLoading(false);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImageFile) return;

    setLoading(true);
    setBestMove("");
    setBoardSVG("");

    // Convert selected image to Base64
    const reader = new FileReader();
    reader.readAsDataURL(selectedImageFile);

    reader.onloadend = async () => {
      const base64Image = reader.result.split(",")[1];

      try {
        // Send Base64 to Flask
        const response = await fetch("http://localhost:5000/process_image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: base64Image,
            white_or_black_top: "white",
            player: "w",
          }),
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error);

        // Display returned data
        setBestMove(`Best move: ${data.fen}`);
        setBoardSVG(data.svg); // <-- show chessboard SVG
        console.log("FEN:", data.fen);
        console.log("SVG:", data.svg);
        console.log("Lichess link:", data.lichess_url);

      } catch (err) {
        console.error(err);
        setBestMove("Error analyzing image");
      }

      setLoading(false);
    };
  };

  return (
    <div className="min-h-screen w-screen flex flex-col bg-black font-sans relative overflow-hidden">
      {/* Animated background effects */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.02) 2px, transparent 2px)`,
          backgroundSize: '64px 64px',
          animation: 'gridMove 20s linear infinite'
        }}></div>
      </div>

      {/* Dynamic light orbs */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-white/5 rounded-full blur-[150px]" style={{ animation: 'pulse 8s ease-in-out infinite' }}></div>
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-white/4 rounded-full blur-[140px]" style={{ animation: 'pulse 6s ease-in-out infinite', animationDelay: '2s' }}></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-white/3 rounded-full blur-[120px]" style={{ animation: 'pulse 10s ease-in-out infinite', animationDelay: '4s' }}></div>

      {/* Header with branding */}
      <div className="relative z-10 backdrop-blur-2xl border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/90 via-black/70 to-transparent"></div>
        
        {/* Top bar with logo */}
        <div className="relative px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="relative group">
              <div className="absolute inset-0 bg-white/20 blur-xl rounded-full scale-75 group-hover:scale-100 transition-transform duration-500"></div>
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-500">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 22H5v-2h14v2M17.16 8.26A3.25 3.25 0 0 0 19 5.75C19 4.23 17.77 3 16.25 3S13.5 4.23 13.5 5.75c0 1.03.48 1.95 1.23 2.55L13.5 10.5h-3l-1.23-2.2c.75-.6 1.23-1.52 1.23-2.55C10.5 4.23 9.27 3 7.75 3S5 4.23 5 5.75c0 1.18.66 2.2 1.63 2.74L6 10.5c0 1.5.67 2.5 2 2.5v7h8v-7c1.33 0 2-1 2-2.5l-.63-2.01c.47-.26.85-.65 1.13-1.13.28-.48.47-1.03.47-1.61z"/>
                </svg>
              </div>
            </div>
            
            {/* Brand name */}
            <div className="flex flex-col">
              <h1 className="text-2xl font-light tracking-wider text-white">
                Dr<span className="text-neutral-500">.</span><span className="font-normal">Chess</span>
              </h1>
              <p className="text-xs text-neutral-500 tracking-[0.3em] uppercase">AI Strategy Analysis</p>
            </div>
          </div>

          {/* Status indicator */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <div className="relative">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full blur-sm animate-pulse"></div>
            </div>
            <span className="text-xs text-neutral-400 tracking-wider">ONLINE</span>
          </div>
        </div>

        {/* Main title section */}
        <div className="relative text-center py-8 px-8">
          <div className="relative inline-block">
            <h2 className="text-5xl font-extralight tracking-[0.25em] text-white mb-2">
              MOVE ANALYZER
            </h2>
            <div className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
          </div>
          <p className="text-sm text-neutral-500 tracking-[0.2em] uppercase mt-6">Powered by Advanced AI Vision</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 w-full px-[5vw] py-16 flex flex-col">
        <div className="w-full max-w-[1000px] mx-auto flex flex-col gap-12">
          {/* Upload Area */}
          <div
            onClick={() => document.getElementById('fileInput').click()}
            className="relative w-full h-[55vh] min-h-[360px] cursor-pointer group"
          >
            {/* Animated border */}
            <div className="absolute inset-0 rounded-[2rem] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-white/10 p-[2px]">
                <div className="w-full h-full rounded-[2rem] bg-gradient-to-br from-neutral-900/50 via-black/70 to-neutral-950/50 backdrop-blur-2xl overflow-hidden">
                  {selectedImage ? (
                    <div className="relative w-full h-full">
                      <img
                        src={selectedImage}
                        alt="Chessboard Preview"
                        className="w-full h-full object-contain p-6"
                      />
                      {/* Overlay with info */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-8">
                        <div className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20">
                          <span className="text-white text-sm tracking-wider">READY TO ANALYZE</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400">
                      {/* Animated chess piece */}
                      <div className="relative mb-8">
                        <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full scale-75 group-hover:scale-110 transition-transform duration-700"></div>
                        <svg
                          className="w-24 h-24 relative z-10 opacity-50 group-hover:opacity-70 transition-all duration-700 transform group-hover:scale-110 group-hover:rotate-12"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19 22H5v-2h14v2M17.16 8.26A3.25 3.25 0 0 0 19 5.75C19 4.23 17.77 3 16.25 3S13.5 4.23 13.5 5.75c0 1.03.48 1.95 1.23 2.55L13.5 10.5h-3l-1.23-2.2c.75-.6 1.23-1.52 1.23-2.55C10.5 4.23 9.27 3 7.75 3S5 4.23 5 5.75c0 1.18.66 2.2 1.63 2.74L6 10.5c0 1.5.67 2.5 2 2.5v7h8v-7c1.33 0 2-1 2-2.5l-.63-2.01c.47-.26.85-.65 1.13-1.13.28-.48.47-1.03.47-1.61z"/>
                        </svg>
                      </div>
                      
                      <p className="text-2xl font-light mb-3 tracking-[0.15em] group-hover:text-white transition-colors duration-500">UPLOAD POSITION</p>
                      <p className="text-sm text-neutral-500 tracking-[0.15em] mb-8">PNG · JPG · JPEG</p>
                      
                      {/* File format badges */}
                      <div className="flex gap-3">
                        {['PNG', 'JPG', 'JPEG'].map((format, i) => (
                          <div key={format} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs tracking-wider text-neutral-500 hover:bg-white/10 hover:text-neutral-400 transition-all duration-300" style={{ transitionDelay: `${i * 50}ms` }}>
                            {format}
                          </div>
                        ))}
                      </div>

                      {/* Floating chess squares */}
                      <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-[20%] left-[15%] w-3 h-3 border border-white/20 rotate-45 animate-floatSlow"></div>
                        <div className="absolute top-[30%] right-[20%] w-2 h-2 bg-white/20 animate-floatSlow" style={{ animationDelay: '1s' }}></div>
                        <div className="absolute bottom-[25%] left-[25%] w-2 h-2 border border-white/15 rotate-45 animate-floatSlow" style={{ animationDelay: '2s' }}></div>
                        <div className="absolute bottom-[35%] right-[15%] w-3 h-3 bg-white/15 rotate-45 animate-floatSlow" style={{ animationDelay: '1.5s' }}></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Enhanced corner accents */}
            <div className="absolute -top-1 -left-1 w-12 h-12 border-t-2 border-l-2 border-white/30 rounded-tl-[2rem] transition-all duration-500 group-hover:w-16 group-hover:h-16 group-hover:border-white/50"></div>
            <div className="absolute -top-1 -right-1 w-12 h-12 border-t-2 border-r-2 border-white/30 rounded-tr-[2rem] transition-all duration-500 group-hover:w-16 group-hover:h-16 group-hover:border-white/50"></div>
            <div className="absolute -bottom-1 -left-1 w-12 h-12 border-b-2 border-l-2 border-white/30 rounded-bl-[2rem] transition-all duration-500 group-hover:w-16 group-hover:h-16 group-hover:border-white/50"></div>
            <div className="absolute -bottom-1 -right-1 w-12 h-12 border-b-2 border-r-2 border-white/30 rounded-bl-[2rem] transition-all duration-500 group-hover:w-16 group-hover:h-16 group-hover:border-white/50"></div>

            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* Show SVG Board */}
          {boardSVG && (
            <div className="w-full max-w-[600px] mx-auto mt-6 p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl">
              <img
                src={`data:image/svg+xml;base64,${boardSVG}`}
                alt="Analyzed Chessboard"
                className="w-full h-auto"
              />
            </div>
          )}

          {/* Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              className="relative group"
              disabled={loading}
            >
              {/* Button glow layers */}
              <div className="absolute inset-0 bg-white blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-700 rounded-2xl"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl" style={{ animation: 'shimmer 2s infinite' }}></div>
              
              <div className="relative px-14 py-5 rounded-2xl bg-white text-black overflow-hidden transition-all duration-500 group-hover:shadow-[0_0_50px_rgba(255,255,255,0.5)] disabled:opacity-30 disabled:cursor-not-allowed">
                <span className="relative z-10 flex items-center gap-4 font-light tracking-[0.2em] text-sm">
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>ANALYZING POSITION</span>
                    </>
                  ) : (
                    <>
                      <span>INITIATE ANALYSIS</span>
                      <svg className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </span>
              </div>
            </button>
          </div>

          {/* Results */}
          {bestMove && (
            <div className="relative animate-slideUp">
              {/* Result glow effect */}
              <div className="absolute -inset-8 bg-gradient-to-r from-white/0 via-white/10 to-white/0 blur-3xl rounded-[3rem]"></div>
              
              <div className="relative bg-gradient-to-br from-neutral-900/70 via-black/90 to-neutral-950/70 backdrop-blur-2xl rounded-[2rem] border border-white/20 p-10 shadow-2xl overflow-hidden">
                {/* Top decorative elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
                <div className="absolute top-4 left-8 w-2 h-2 bg-white/30 rounded-full"></div>
                <div className="absolute top-4 right-8 w-2 h-2 bg-white/30 rounded-full"></div>

                <div className="flex justify-between items-center mb-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-light text-neutral-500 tracking-[0.3em] uppercase">Dr.Chess Recommendation</span>
                    <span className="text-2xl font-light text-white tracking-wider">Optimal Strategy</span>
                  </div>
                </div>

                {/* Main result display */}
                <div className="relative bg-gradient-to-r from-white/5 to-white/10 rounded-xl p-6 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      {/* Chess piece icon */}
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <svg className="w-9 h-9 text-white relative z-10" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 22H5v-2h14v2M17.16 8.26A3.25 3.25 0 0 0 19 5.75C19 4.23 17.77 3 16.25 3S13.5 4.23 13.5 5.75c0 1.03.48 1.95 1.23 2.55L13.5 10.5h-3l-1.23-2.2c.75-.6 1.23-1.52 1.23-2.55C10.5 4.23 9.27 3 7.75 3S5 4.23 5 5.75c0 1.18.66 2.2 1.63 2.74L6 10.5c0 1.5.67 2.5 2 2.5v7h8v-7c1.33 0 2-1 2-2.5l-.63-2.01c.47-.26.85-.65 1.13-1.13.28-.48.47-1.03.47-1.61z"/>
                        </svg>
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-neutral-500 tracking-wider uppercase">Best Move</span>
                        <span className="text-4xl font-mono text-white tracking-[0.1em]">{bestMove.split(': ')[1]}</span>
                      </div>
                    </div>

                    {/* Confidence indicator */}
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-xs text-neutral-500 tracking-wider uppercase">Confidence</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-white to-neutral-300 rounded-full" style={{ width: '94%', animation: 'fillBar 1s ease-out' }}></div>
                        </div>
                        <span className="text-sm text-white font-mono">94%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom decorative line */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer branding */}
      <div className="relative z-10 text-center py-8 border-t border-white/5">
        <p className="text-xs text-neutral-600 tracking-[0.3em] uppercase">© 2024 Dr.Chess · AI-Powered Chess Analysis</p>
      </div>

      <style>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(64px, 64px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
        
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); opacity: 0.2; }
          50% { transform: translateY(-30px) translateX(15px) rotate(180deg); opacity: 0.5; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes fillBar {
          from { width: 0%; }
          to { width: 94%; }
        }
        
        .animate-floatSlow {
          animation: floatSlow 6s ease-in-out infinite;
        }
        
        .animate-slideUp {
          animation: slideUp 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}