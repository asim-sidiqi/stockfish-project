from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import os

app = Flask(__name__)

# Load your chess model
MODEL_PATH = "chess_model.keras"
if os.path.exists(MODEL_PATH):
    model = load_model(MODEL_PATH)
    print("Model loaded successfully.")
else:
    model = None
    print("Model file not found. Using placeholder output.")

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    # Save uploaded file temporarily
    os.makedirs("temp", exist_ok=True)
    filepath = os.path.join("temp", file.filename)
    file.save(filepath)

    # 🔹 Preprocess image to 240x240
    img = image.load_img(filepath, target_size=(240, 240))
    x = image.img_to_array(img)
    x = np.expand_dims(x, axis=0)  # shape: (1, 240, 240, 3)
    x = x / 255.0  # normalize

    # Normally you'd predict with model here
    predictions = model.predict(x)
    # For now, we just return a placeholder
    prediction = np.argmax(predictions, axis=1)[0]

    # Delete temp file
    os.remove(filepath)

    return jsonify({"prediction": "placeholder_output"})

if __name__ == "__main__":
    app.run(debug=True, port=8000)
