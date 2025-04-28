from models import fine_tuned_model
from utils.preprocessing import preprocess_image

def classify_damaged_or_whole(image_path):
    preprocessed_img = preprocess_image(image_path)
    prediction = fine_tuned_model.predict(preprocessed_img)
    if prediction[0][0] < 0.5:
        return "damaged"
    else:
        return "whole"
