# ChessVision Setup Instructions

Complete guide to set up and run the ChessVision API from scratch.

## Prerequisites

- Python 3.11.7 (or compatible version 3.9+)
- Linux/Ubuntu system (for the provided Stockfish binary)
- Git (for cloning the repository)

---

## 📋 Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone https://github.com/MichielCreemers/ChessVision.git
cd ChessVision
```

### 2. Create a Virtual Environment

Create and activate a Python virtual environment to isolate dependencies:

```bash
# Create virtual environment
python3 -m venv .venv

# Activate virtual environment
source .venv/bin/activate
```

> **Note:** On Windows, use `.venv\Scripts\activate` instead.

You should see `(.venv)` in your terminal prompt indicating the virtual environment is active.

### 3. Install Python Dependencies

Install all required Python packages:

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**Required packages include:**
- Flask (web API framework)
- OpenCV (image processing)
- Ultralytics YOLOv8 (object detection)
- Stockfish (chess engine wrapper)
- PyTorch (deep learning framework)
- NumPy, Pillow, scikit-image, scipy

> **Note:** If you encounter any missing dependencies, install them individually with `pip install <package-name>`.

### 4. Download Pre-trained Models

Download the YOLOv8 models and place them in the `models/` directory:

#### Required Models:

1. **Corner Detection Model**
   - Download: [corners_best.pt](https://1drv.ms/u/s!AtF_ruDO-AX-kUTz1-GwVH9S7PBd?e=z4Oar3)
   - Rename to: `corners_best_win.pt`
   - Place at: `models/corners_best_win.pt`

2. **Grid Segmentation Model**
   - Download: [segment_grid.pt](https://1drv.ms/u/s!AtF_ruDO-AX-jiA2mkErqoB3VrHU?e=rlrAb1)
   - Place at: `models/segment_grid.pt`

3. **Piece Detection Model (choose one or both):**
   
   **Option A: Large Model** (recommended - better accuracy)
   - Download: [pieces_large.pt](https://1drv.ms/u/s!AtF_ruDO-AX-kUPtnTvaNnW-0rdN?e=6rK2Qc)
   - Place at: `models/pieces_large.pt`
   
   **Option B: Nano Model** (faster inference)
   - Download: [pieces_nano.pt](https://1drv.ms/u/s!AtF_ruDO-AX-kUYP2Mp7a614Jh5J?e=Dv3fJ0)
   - Place at: `models/pieces_nano.pt`

**Verify your models directory:**
```bash
ls models/
# Should show:
# corners_best_win.pt
# segment_grid.pt
# pieces_large.pt (and/or pieces_nano.pt)
```

### 5. Download and Install Stockfish Chess Engine

Download the Stockfish engine for your platform:

#### For Linux (Ubuntu/Debian):

```bash
# Create stockfish directory
mkdir -p stockfish
cd stockfish

# Download Stockfish (replace with latest version)
wget https://github.com/official-stockfish/Stockfish/releases/download/sf_16/stockfish-ubuntu-x86-64-avx2.tar

# Extract
tar -xf stockfish-ubuntu-x86-64-avx2.tar

# Make executable
chmod +x stockfish/stockfish-ubuntu-x86-64-avx2

# Return to project root
cd ..
```

#### For macOS:

```bash
# Using Homebrew
brew install stockfish

# Or download from https://stockfishchess.org/download/
```

#### For Windows:

Download from [Stockfish Downloads](https://stockfishchess.org/download/) and extract to a `stockfish/` directory.

### 6. Configure config.json

Edit the `config.json` file to match your setup:

```json
{
    "pieces_model": "large",
    "piece_sampling": 10,
    "corner_conf": 0.15,
    "corner_iou": 0.1,
    "pieces_conf": 0.5,
    "pieces_iou": 0.35,
    "offsetx": 300,
    "offsety": 300,
    "stockfish_path": "/path/to/your/stockfish/executable",
    "debug": "False"
}
```

**Update the `stockfish_path` to match your installation:**

For Linux:
```json
"stockfish_path": "stockfish/stockfish-ubuntu-x86-64-avx2"
```

For macOS (Homebrew):
```json
"stockfish_path": "/usr/local/bin/stockfish"
```

For Windows:
```json
"stockfish_path": "stockfish/stockfish-windows-x86-64-avx2.exe"
```

**Configuration Options:**
- `pieces_model`: Choose `"large"` (better accuracy) or `"nano"` (faster)
- `piece_sampling`: Number of samples per piece bounding box (default: 10)
- `corner_conf`: Corner detection confidence threshold (default: 0.15)
- `corner_iou`: Corner detection IoU threshold (default: 0.1)
- `pieces_conf`: Piece detection confidence threshold (default: 0.5)
- `pieces_iou`: Piece detection IoU threshold (default: 0.35)
- `offsetx`, `offsety`: Offsets for image transformation (default: 300)
- `debug`: Enable debug mode (`"True"` or `"False"`)

### 7. Verify Stockfish Installation

Test that Stockfish is working:

```bash
# Activate virtual environment if not already active
source .venv/bin/activate

# Test stockfish
python3 -c "from stockfish import Stockfish; s = Stockfish('stockfish/stockfish-ubuntu-x86-64-avx2'); print('Stockfish OK!')"
```

You should see `Stockfish OK!` if everything is configured correctly.

---

## 🚀 Running the API

### Start the API Server

With your virtual environment activated:

```bash
python run_api.py
```

You should see:
```
*****************************************************************************
[ASCII Art Banner]
*****************************************************************************
Loading API arguments
-----------------------------------------------------------------------------
Pieces are detected using: large YOLO8 model
Mapping pieces to grid is done by using 10 samples
-----------------------------------------------------------------------------
Models loaded
-----------------------------------------------------------------------------
 * Serving Flask app 'run_api'
 * Debug mode: on
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:5000
 * Running on http://192.168.x.x:5000
```

The API is now running and accessible at `http://localhost:5000`

### Test the API

In a new terminal (keep the API running in the first terminal):

```bash
# Activate virtual environment
source .venv/bin/activate

# Run test script
python3 test_api_call.py
```

Or test with curl:

```bash
curl http://localhost:5000/hello
```

Should return: `{"message":"Hello, World!"}`

---

## 📝 Quick Reference

### Activate Virtual Environment
```bash
source .venv/bin/activate  # Linux/macOS
.venv\Scripts\activate      # Windows
```

### Deactivate Virtual Environment
```bash
deactivate
```

### Start API Server
```bash
python run_api.py
```

### Test API
```bash
python3 test_api_call.py
```

---

## 🔧 Troubleshooting

### Issue: `ModuleNotFoundError`
**Solution:** Make sure virtual environment is activated and all dependencies are installed:
```bash
source .venv/bin/activate
pip install -r requirements.txt
```

### Issue: `Stockfish not found` or `FileNotFoundError`
**Solution:** 
1. Verify Stockfish is downloaded and extracted
2. Check the path in `config.json` is correct
3. Ensure Stockfish binary has execute permissions (Linux/macOS):
   ```bash
   chmod +x stockfish/stockfish-ubuntu-x86-64-avx2
   ```

### Issue: Model files not found
**Solution:** 
1. Verify all models are downloaded
2. Check they're in the `models/` directory
3. Verify filenames match exactly:
   - `corners_best_win.pt`
   - `segment_grid.pt`
   - `pieces_large.pt` (or `pieces_nano.pt`)

### Issue: CUDA/GPU errors
**Solution:** The models will run on CPU by default. If you want GPU acceleration:
```bash
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118
```
(Replace `cu118` with your CUDA version)

### Issue: API returns "Invalid FEN notation"
**Solution:**
1. Ensure the chess board is clearly visible
2. Try adjusting confidence thresholds in `config.json`
3. Use better lighting when taking the photo
4. The models are trained on a specific chess set - different boards may have lower accuracy

### Issue: Connection refused when testing
**Solution:** Make sure the API server is running in another terminal before running tests.

---

## 📁 Project Structure

```
ChessVision/
├── run_api.py              # Main Flask API server
├── config.json             # Configuration file
├── requirements.txt        # Python dependencies
├── test_api_call.py       # Test script
├── API_DOCUMENTATION.md   # API usage documentation
├── SETUP_INSTRUCTIONS.md  # This file
├── board/                 # Core processing modules
│   ├── corners.py         # Corner detection
│   ├── grid.py           # Grid segmentation
│   ├── pieces.py         # Piece detection
│   └── moves.py          # Move calculation
├── models/               # Pre-trained YOLO models (download here)
│   ├── corners_best_win.pt
│   ├── segment_grid.pt
│   └── pieces_large.pt
├── stockfish/           # Stockfish chess engine (download here)
│   └── stockfish-ubuntu-x86-64-avx2
├── images/             # Sample images
│   └── test_images/
├── uploads/           # Uploaded images (auto-created)
└── .venv/            # Virtual environment (auto-created)
```

---

## 🎯 Next Steps

After successful setup:

1. Read `API_DOCUMENTATION.md` for detailed API usage
2. Try the test images in `images/test_images/`
3. Experiment with different `config.json` settings
4. Take photos of your own chess boards (note: trained on specific chess set)

---

## 📚 Additional Resources

- [YOLOv8 Documentation](https://docs.ultralytics.com/)
- [Stockfish Documentation](https://stockfishchess.org/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [FEN Notation Guide](https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation)

---

## ⚠️ Important Notes

- **Chess Set Compatibility:** Models are trained on one specific chess set. Performance may drop significantly on different boards.
- **Network Access:** By default, the API runs on `0.0.0.0:5000`, making it accessible to other devices on your network.
- **Security:** This is a development server. For production deployment, use a proper WSGI server like Gunicorn or uWSGI.

---

## 🤝 Contributing

If you improve the models or add features, consider:
- Expanding the training dataset with more chess sets
- Implementing the TODOs mentioned in README.md
- Improving board orientation detection
- Adding support for more FEN parameters

---

## 📄 License

See the original repository for license information.
