from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import os
import easyocr

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads/"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Initialize EasyOCR Reader
reader = easyocr.Reader(['en'], gpu=False)  # Set gpu=True if you have a GPU installed and configured

@app.route("/upload", methods=["POST"])
def upload_file():
    if "image" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["image"]
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    
    # Save file to the uploads folder
    try:
        file.save(filepath)
    except Exception as e:
        return jsonify({"error": f"Error saving file: {str(e)}"}), 500

    # Process image with EasyOCR
    try:
        results = reader.readtext(filepath, detail=1)  # detail=1 for full details of text, confidence, and bounding box

        # Check if any text was detected
        if not results:
            return jsonify({"error": "No text detected in the image."}), 200

        # Extract text from results
        extracted_text = "\n".join([result[1] for result in results])  # Combine all detected text
        return jsonify({"text": extracted_text})
    except Exception as e:
        return jsonify({"error": f"Error processing file: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)
    