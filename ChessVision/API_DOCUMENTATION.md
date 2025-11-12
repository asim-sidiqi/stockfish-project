# ChessVision API Documentation

## Endpoints

### 1. Health Check
**GET** `/hello`

Returns a simple message to verify the API is running.

**Response:**
```json
{
  "message": "Hello, World!"
}
```

---

### 2. Process Chess Image
**POST** `/process_image`

Analyzes a chess board image and returns the board position, best move visualization, FEN notation, and Lichess analysis URL.

#### Request Body (JSON)

```json
{
  "image": "<base64_encoded_jpeg_image>",
  "player": "w",
  "white_or_black_top": "black"
}
```

**Parameters:**
- `image` (string, required): Base64-encoded JPEG image of the chess board
- `player` (string, required): Current player's turn
  - `"w"` for white
  - `"b"` for black
- `white_or_black_top` (string, required): Which color is at the top of the image
  - `"white"` - white pieces are at the top
  - `"black"` - black pieces are at the top

#### Response (200 OK)

```json
{
  "svg": "<base64_encoded_svg>",
  "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  "lichess_url": "https://lichess.org/analysis/rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR_w_KQkq_-_0_1"
}
```

**Response Fields:**
- `svg` (string): Base64-encoded SVG visualization of the board with the best move highlighted
- `fen` (string): FEN (Forsyth-Edwards Notation) representation of the board position
- `lichess_url` (string): Direct URL to analyze the position on Lichess.org

#### Error Responses

**400 Bad Request** - Invalid player value
```json
{
  "error": "Invalid player value"
}
```

**400 Bad Request** - Invalid FEN notation
```json
{
  "error": "Invalid FEN notation"
}
```

**400 Bad Request** - No image sent
```json
{
  "error": "No image has been sent"
}
```

---

## Orientation Guide

### Understanding `white_or_black_top` Parameter

This parameter tells the API which color pieces are at the **top** of your photograph.

**Common Scenarios:**

1. **Photo from white's perspective** (standing behind white pieces):
   - `white_or_black_top: "black"` (black pieces at top, white at bottom)

2. **Photo from black's perspective** (standing behind black pieces):
   - `white_or_black_top: "white"` (white pieces at top, black at bottom)

### Quick Rule
- Standing behind **white** pieces → `"black"` on top
- Standing behind **black** pieces → `"white"` on top

---

## Example Usage

### Using cURL

```bash
curl -X POST http://localhost:5000/process_image \
     -H "Content-Type: application/json" \
     -d '{
       "image": "'$(base64 -w 0 chessboard.jpg)'",
       "player": "w",
       "white_or_black_top": "black"
     }'
```

### Using Python

```python
import requests
import base64

# Read and encode image
with open("chessboard.jpg", "rb") as f:
    image_data = base64.b64encode(f.read()).decode("utf-8")

# Make request
response = requests.post(
    "http://localhost:5000/process_image",
    json={
        "image": image_data,
        "player": "w",
        "white_or_black_top": "black"
    }
)

# Parse response
result = response.json()
print(f"FEN: {result['fen']}")
print(f"Lichess URL: {result['lichess_url']}")

# Save SVG
with open("output.svg", "wb") as f:
    f.write(base64.b64decode(result['svg']))
```

---

## What the FEN Notation Means

FEN (Forsyth-Edwards Notation) is a standard notation for describing a chess position. Example:

```
rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
```

**Structure:**
1. **Piece placement** - `rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR`
   - Lowercase = black pieces, Uppercase = white pieces
   - Numbers = empty squares
   - `/` = new rank (row)
   
2. **Active color** - `w` (white to move) or `b` (black to move)

3. **Castling rights** - `KQkq` (K=white kingside, Q=white queenside, k=black kingside, q=black queenside)

4. **En passant** - `-` or target square

5. **Halfmove clock** - moves since last pawn move or capture

6. **Fullmove number** - increments after black's move

---

## Lichess Integration

The API automatically generates a Lichess analysis URL for easy position analysis. Simply open the URL in your browser to:

- Analyze the position with Stockfish
- Explore variations
- Share the position with others
- Practice from this position

Example URL:
```
https://lichess.org/analysis/rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR_w_KQkq_-_0_1
```
