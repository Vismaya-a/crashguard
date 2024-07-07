from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array, load_img, array_to_img
import numpy as np
import os
import cv2
import google.generativeai as genai
severity=""
gemini_response="" # Replace with actual response storage variable
# final_severity=""  # Replace with actual severity storage variable
# recommendation=""

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the models
fine_tuned_model = load_model('facefeatures_new_model (2).h5')
location_model = load_model('model_with_4_classes_front_rear_side.h5')
severity_model = load_model('model_with_3_classes.h5')

app.config['UPLOAD_FOLDER'] = 'static/upload/'

# Severity levels
severity_levels = ["Minor", "Minor to Moderate", "Moderate", "Moderate to Severe", "Severe"]

# Enhanced image preprocessing function
def preprocess_image(image_path):
    # Load the image
    img = load_img(image_path)
    
    # Convert to numpy array
    img_array = img_to_array(img)

    # Resize the image
    img_resized = cv2.resize(img_array, (224, 224))

    # Convert back to PIL Image for consistency
    img = array_to_img(img_resized)

    # Convert to numpy array again
    img_array = img_to_array(img)

    # Expand dimensions to fit model input
    img_array = np.expand_dims(img_array, axis=0)

    # Normalize pixel values to [0, 1]
    img_array /= 255.0

    # Apply additional preprocessing steps
    img_array = preprocess_additional(img_array)
    
    return img_array

def preprocess_additional(img_array):
    # Example: Adjust brightness and contrast (if needed)
    img_array = img_array * 1.1  # Increase brightness
    img_array = np.clip(img_array, 0, 1)  # Ensure pixel values are within [0, 1]

    # Add other preprocessing steps here if necessary
    # For example, adding Gaussian noise, rotation, etc.

    return img_array

def classify_damaged_or_whole(image_path):
    preprocessed_img = preprocess_image(image_path)
    prediction = fine_tuned_model.predict(preprocessed_img)
    if prediction[0][0] < 0.5:
        return "damaged"
    else:
        return "whole"

def classify_damage_location(image_path):
    preprocessed_img = preprocess_image(image_path)
    prediction = location_model.predict(preprocessed_img)
    class_labels = ['front', 'back', 'rear']
    predicted_class = np.argmax(prediction)
    return class_labels[predicted_class]

def classify_damage_severity(image_path):
    preprocessed_img = preprocess_image(image_path)
    prediction = severity_model.predict(preprocessed_img)
    class_labels = ['Minor', 'Moderate', 'Severe']
    predicted_class = np.argmax(prediction)
    return class_labels[predicted_class]

def classify_car_image(image_path):
    global severity
    condition = classify_damaged_or_whole(image_path)
    if condition == "whole":
        return "The car is classified as whole."
    else:
        location = classify_damage_location(image_path)
        severity = classify_damage_severity(image_path)
        return f"The car is classified as damaged. Location of damage: {location}. Severity of damage: {severity}."

def query_gemini(api_key, question):
    genai.configure(api_key=api_key)
    model_name = "gemini-1.5-pro-latest"
    generation_config = {
        "temperature": 1.0,
        "top_p": 0.99,
    }
    model = genai.GenerativeModel(model_name, generation_config=generation_config)
    response = model.generate_content(question)
    print("Gemini Response:", response.text)
    return response.text

def average_severity(situational_severity, damage_severity):
    situational_index = severity_levels.index(situational_severity)
    damage_index = severity_levels.index(damage_severity)
    average_index = (situational_index + damage_index) / 2
    final_index = int(average_index + 0.5)
    final_severity = severity_levels[final_index]
    return final_severity

def provide_recommendation(final_severity):
    moderate_index = severity_levels.index("Moderate")
    final_index = severity_levels.index(final_severity)
    if final_index >= moderate_index:
        return "You should move legally and claim insurance."
    else:
        return "It's advisable to settle onsite."

@app.route('/classify', methods=['POST'])
def classify_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    filename = file.filename
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)

    try:
        result = classify_car_image(filepath)
        return jsonify({'result': result, 'image_url': filepath}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/ask_gemini', methods=['POST'])
def ask_gemini():
    global severity
    global gemini_response # Replace with actual response storage variable
    # global final_severity # Replace with actual severity storage variable
    # global recommendation
    data = request.json
    if not data or 'accidentReport' not in data or 'situationalSeverity' not in data:
        return jsonify({'error': 'Insufficient data provided.'}), 400
    
    accident_report = data['accidentReport']
    situational_severity = data['situationalSeverity']
    api_key = "AIzaSyBIZlc2zDjZD3wMJIqP68xKAuugGW20clY"  # Replace with your actual API key

    try:
        if severity == "":
            return jsonify({'error': 'Severity has not been set.'}), 400
        
        final_severity = average_severity(situational_severity, severity)
        recommendation = provide_recommendation(final_severity)
        
        if recommendation == "It's advisable to settle onsite.":
            return jsonify({'response': recommendation}), 200
        
        gemini_response = query_gemini(api_key, accident_report)
        print(gemini_response)
        return jsonify({'response': gemini_response, 'final_severity': final_severity, 'recommendation': recommendation}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': str(e)}), 500
@app.route('/get_gemini_response', methods=['GET'])
def get_gemini_response():
    global response # Replace with actual response storage variable
    # global final_severity # Replace with actual severity storage variable
    # global recommendation
    # Assuming `gemini_response` is stored somewhere accessible
    # You might need to adapt this depending on your specific implementation
    try:
        response = {
            'response': gemini_response  # Replace with actual response storage variable
            # 'final_severity': final_severity,  # Replace with actual severity storage variable
            # 'recommendation': recommendation  # Replace with actual recommendation storage variable
        }
        return jsonify(response), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': str(e)}), 500



if __name__ == "__main__":
    app.run(debug=True)
