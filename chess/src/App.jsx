// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import ChessAnalyzer from "./pages/ChessAnalyzer";

function App() {
  return (
    <div className='font-poppins'>
      <Router>               
        <Routes>
          <Route path="/" element={<ChessAnalyzer />} />
          {/* <Route path="/chess-analyze" element={<ChessAnalyze />} /> */}
          
        </Routes>
      </Router>
    </div>
  );
}

export default App;
