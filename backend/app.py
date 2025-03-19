from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import os
import easyocr
import numpy as np
import cv2

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads/"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Initialize EasyOCR Reader with enhanced settings for handwritten text
reader = easyocr.Reader(['en'], gpu=False, model_storage_directory='./models')  # Set gpu=True if you have a GPU

def preprocess_image(image_path):
    # Read the image
    img = cv2.imread(image_path)
    
    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Apply adaptive thresholding to better isolate text
    thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
                                  cv2.THRESH_BINARY_INV, 11, 2)
    
    # Noise removal
    kernel = np.ones((1, 1), np.uint8)
    opening = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel)
    
    # Save the preprocessed image
    preprocessed_path = image_path + "_preprocessed.jpg"
    cv2.imwrite(preprocessed_path, opening)
    
    return preprocessed_path

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
        # Preprocess the image to enhance text detection
        preprocessed_path = preprocess_image(filepath)
        
        # First try with handwritten text optimization
        results = reader.readtext(
            preprocessed_path, 
            detail=1,
            paragraph=True,  # Group text into paragraphs
            contrast_ths=0.1,  # Lower threshold for contrast
            adjust_contrast=0.5,  # Adjust contrast to help with handwritten text
            text_threshold=0.7,  # Lower confidence threshold for text detection
            low_text=0.3,  # Lower threshold for text detection
            slope_ths=0.1,  # Allow more sloped text (common in handwriting)
            width_ths=0.2,  # Allow more variation in character width
        )

        # If no results, try with the original image as backup
        if not results:
            results = reader.readtext(filepath, detail=1)

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
    