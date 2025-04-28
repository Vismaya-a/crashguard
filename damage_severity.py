from models import severity_model
from utils.preprocessing import preprocess_image

def classify_damage_severity(image_path):
    preprocessed_img = preprocess_image(image_path)
    prediction = severity_model.predict(preprocessed_img)
    class_labels = ['Minor', 'Moderate', 'Severe']
    predicted_class = np.argmax(prediction)
    return class_labels[predicted_class]
