from models import location_model
from utils.preprocessing import preprocess_image

def classify_damage_location(image_path):
    preprocessed_img = preprocess_image(image_path)
    prediction = location_model.predict(preprocessed_img)
    class_labels = ['front', 'back', 'rear']
    predicted_class = np.argmax(prediction)
    return class_labels[predicted_class]
